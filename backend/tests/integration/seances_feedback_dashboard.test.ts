import request from "supertest";
import { createApp } from "../../src/app";
import { Exercice } from "../../src/models/exercice.model";
import { PhaseProgramme, ZoneCorps } from "../../src/constants/enums";

const app = createApp();

async function signup() {
  const r = await request(app).post("/api/auth/signup").send({
    email: "sf@test.com",
    mot_de_passe: "Password123!"
  });
  return r.body.data.tokens.accessToken as string;
}

async function seedExercises() {
  await Exercice.insertMany(
    Array.from({ length: 12 }).map((_, i) => ({
      titre: `E${i + 1}`,
      description: "desc",
      phase_cible: i < 4 ? PhaseProgramme.PHASE_1 : i < 8 ? PhaseProgramme.PHASE_2 : PhaseProgramme.PHASE_3,
      zone_cible: ZoneCorps.RACHIS,
      niveau_min: 1,
      niveau_max: 10,
      url_video: "https://example.com/v.mp4",
      duree_recommandee_sec: 30,
      valide_securite: true
    }))
  );
}

describe("Séances / Feedback / Dashboard", () => {
  it("GET seance then POST feedback returns adaptation", async () => {
    const token = await signup();
    await seedExercises();

    const bilan = await request(app)
      .post("/api/bilans")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type_bilan: "AUTO_COMPLET",
        date_bilan: "2025-12-30",
        tests: [
          {
            type_test: "MOBILITE",
            zone_corps: "RACHIS",
            amplitude: "MOYENNE",
            fluidite: "MOYENNE",
            sensation: "NEUTRE",
            asymetrie_flag: true,
            douleur_nrs: 1
          }
        ]
      });

    const gen = await request(app)
      .post("/api/programmes/generate")
      .set("Authorization", `Bearer ${token}`)
      .send({ bilan_id: bilan.body.data._id });

    const seanceId = gen.body.data.premiere_seance_id;

    const seance = await request(app).get(`/api/seances/${seanceId}`).set("Authorization", `Bearer ${token}`);
    expect(seance.status).toBe(200);
    expect(seance.body.data.exercices.length).toBeGreaterThan(0);

    const fb = await request(app)
      .post(`/api/seances/${seanceId}/feedback`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rpe: 8, douleur_nrs_post: 3, ressenti_general: "DIFFICILE" });

    expect(fb.status).toBe(200);
    expect(fb.body.data.adaptation).toBeTruthy();
  });

  it("Critical pain feedback blocks programme and creates alert", async () => {
    const token = await signup();
    await seedExercises();

    const bilan = await request(app)
      .post("/api/bilans")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type_bilan: "AUTO_COMPLET",
        date_bilan: "2025-12-30",
        tests: [
          {
            type_test: "MOBILITE",
            zone_corps: "RACHIS",
            amplitude: "MOYENNE",
            fluidite: "MOYENNE",
            sensation: "NEUTRE",
            asymetrie_flag: false,
            douleur_nrs: 0
          }
        ]
      });

    const gen = await request(app)
      .post("/api/programmes/generate")
      .set("Authorization", `Bearer ${token}`)
      .send({ bilan_id: bilan.body.data._id });

    const seanceId = gen.body.data.premiere_seance_id;

    const fb = await request(app)
      .post(`/api/seances/${seanceId}/feedback`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rpe: 6, douleur_nrs_post: 6, ressenti_general: "DIFFICILE" });

    expect(fb.status).toBe(200);
    expect(fb.body.data.adaptation.statut_programme).toBe("BLOQUE");

    const alerts = await request(app).get("/api/alerts").set("Authorization", `Bearer ${token}`);
    expect(alerts.body.data.length).toBeGreaterThan(0);
  });

  it("GET /dashboard returns adherence data", async () => {
    const token = await signup();
    const dash = await request(app).get("/api/dashboard").set("Authorization", `Bearer ${token}`);
    expect(dash.status).toBe(200);
    expect(dash.body.data).toHaveProperty("last_bilan");
  });
});
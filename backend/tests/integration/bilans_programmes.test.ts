import request from "supertest";
import { createApp } from "../../src/app";
import { Exercice } from "../../src/models/exercice.model";
import { PhaseProgramme, ZoneCorps } from "../../src/constants/enums";

const app = createApp();

async function signup() {
  const r = await request(app).post("/api/auth/signup").send({
    email: "bp@test.com",
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

describe("Bilans & Programmes", () => {
  it("GET tests-definition", async () => {
    const token = await signup();
    const res = await request(app).get("/api/bilans/tests-definition").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("POST /bilans creates bilan and triggers alert when douleur>=7", async () => {
    const token = await signup();
    const res = await request(app)
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
            douleur_nrs: 7
          }
        ]
      });

    expect(res.status).toBe(200);

    const alerts = await request(app).get("/api/alerts").set("Authorization", `Bearer ${token}`);
    expect(alerts.body.data.length).toBe(1);
  });

  it("POST /programmes/generate creates programme + premiere_seance_id", async () => {
    const token = await signup();
    await seedExercises();

    const bilanRes = await request(app)
      .post("/api/bilans")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type_bilan: "AUTO_COMPLET",
        date_bilan: "2025-12-30",
        tests: [
          {
            type_test: "MOBILITE",
            zone_corps: "RACHIS",
            amplitude: "BONNE",
            fluidite: "BONNE",
            sensation: "BONNE",
            asymetrie_flag: false,
            douleur_nrs: 0
          }
        ]
      });

    const gen = await request(app)
      .post("/api/programmes/generate")
      .set("Authorization", `Bearer ${token}`)
      .send({ bilan_id: bilanRes.body.data._id });

    expect(gen.status).toBe(200);
    expect(gen.body.data.programme._id).toBeTruthy();
    expect(gen.body.data.premiere_seance_id).toBeTruthy();
  });
});
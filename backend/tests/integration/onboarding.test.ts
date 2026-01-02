import request from "supertest";
import { createApp } from "../../src/app";

const app = createApp();

async function signup() {
  const r = await request(app).post("/api/auth/signup").send({
    email: "onb@test.com",
    mot_de_passe: "Password123!"
  });
  return r.body.data.tokens.accessToken as string;
}

describe("Onboarding", () => {
  it("PUT /users/me updates profile", async () => {
    const token = await signup();
    const res = await request(app)
      .put("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ age: 28, metier: "Etudiant" });

    expect(res.status).toBe(200);
    expect(res.body.data.age).toBe(28);
  });

  it("PUT /users/me/experience-digitale upsert", async () => {
    const token = await signup();
    const res = await request(app)
      .put("/api/users/me/experience-digitale")
      .set("Authorization", `Bearer ${token}`)
      .send({ frequence_telephone: "MOYENNE", preference_notification: "FAIBLE" });

    expect(res.status).toBe(200);
    expect(res.body.data.utilisateur_id).toBeTruthy();
  });

  it("PUT /users/me/experience-sportive upsert", async () => {
    const token = await signup();
    const res = await request(app)
      .put("/api/users/me/experience-sportive")
      .set("Authorization", `Bearer ${token}`)
      .send({ niveau_ressenti: 5, rapport_douleur: "OCCASIONNELLE" });

    expect(res.status).toBe(200);
    expect(res.body.data.niveau_ressenti).toBe(5);
  });
});
import request from "supertest";
import { createApp } from "../../src/app";

const app = createApp();

async function signup() {
  const r = await request(app).post("/api/auth/signup").send({
    email: "c@test.com",
    mot_de_passe: "Password123!"
  });
  return r.body.data.tokens.accessToken as string;
}

describe("Consents", () => {
  it("POST then GET consents", async () => {
    const token = await signup();

    const post = await request(app)
      .post("/api/users/me/consents")
      .set("Authorization", `Bearer ${token}`)
      .send({ type_consentement: "RGPD", version_document: "1.0" });

    expect(post.status).toBe(200);

    const get = await request(app).get("/api/users/me/consents").set("Authorization", `Bearer ${token}`);
    expect(get.status).toBe(200);
    expect(get.body.data.length).toBe(1);
  });
});
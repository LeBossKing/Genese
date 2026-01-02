import request from "supertest";
import { createApp } from "../../src/app";

const app = createApp();

async function signup() {
  const r = await request(app).post("/api/auth/signup").send({
    email: "an@test.com",
    mot_de_passe: "Password123!"
  });
  return r.body.data.tokens.accessToken as string;
}

describe("Alerts & Notifications", () => {
  it("Notifications list + mark as read", async () => {
    const token = await signup();

    // trigger an alert via bilan pain >=7 which also creates notification
    await request(app)
      .post("/api/bilans")
      .set("Authorization", `Bearer ${token}`)
      .send({
        type_bilan: "AUTO_COMPLET",
        date_bilan: "2025-12-30",
        tests: [
          {
            type_test: "MOBILITE",
            zone_corps: "RACHIS",
            amplitude: "FAIBLE",
            fluidite: "FAIBLE",
            sensation: "INCONFORT",
            asymetrie_flag: true,
            douleur_nrs: 7
          }
        ]
      });

    const list = await request(app).get("/api/notifications").set("Authorization", `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.data.length).toBeGreaterThan(0);

    const id = list.body.data[0]._id;
    const upd = await request(app)
      .put(`/api/notifications/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ lu: true });
    expect(upd.body.data.lu).toBe(true);
  });
});
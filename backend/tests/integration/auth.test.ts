import request from "supertest";
import { createApp } from "../../src/app";
import { Administrateur } from "../../src/models/administrateur.model";
import { hashPassword } from "../../src/utils/password";
import { Role } from "../../src/constants/enums";

const app = createApp();

describe("Auth", () => {
  it("signup -> returns tokens", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "u1@test.com",
      mot_de_passe: "Password123!",
      prenom: "Sam"
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeTruthy();
  });

  it("login user -> tokens", async () => {
    await request(app).post("/api/auth/signup").send({
      email: "u2@test.com",
      mot_de_passe: "Password123!"
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "u2@test.com",
      mot_de_passe: "Password123!"
    });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.body.data.refreshToken).toBeTruthy();
  });

  it("refresh -> new tokens", async () => {
    const signup = await request(app).post("/api/auth/signup").send({
      email: "u3@test.com",
      mot_de_passe: "Password123!"
    });
    const refreshToken = signup.body.data.tokens.refreshToken;

    const res = await request(app).post("/api/auth/refresh").send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();
  });

  it("admin login via /auth/login", async () => {
    await Administrateur.create({
      email: "admin@test.com",
      mot_de_passe_hash: await hashPassword("AdminPass123!"),
      role: Role.ADMIN
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      mot_de_passe: "AdminPass123!"
    });
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe(Role.ADMIN);
  });
});
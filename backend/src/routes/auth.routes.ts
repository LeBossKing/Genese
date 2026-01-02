import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { AuthService } from "../services/AuthService";
import { requireAuth } from "../middlewares/auth";

const router = Router();

const signupSchema = z.object({
  body: z.object({
    email: z.string().email(),
    mot_de_passe: z.string().min(8),
    prenom: z.string().optional()
  })
});

router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(async (req, res) => {
    const { email, mot_de_passe, prenom } = req.validated.body;
    const out = await AuthService.signupUser({ email, mot_de_passe, prenom });
    ok(res, out);
  })
);

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    mot_de_passe: z.string().min(1)
  })
});

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const tokens = await AuthService.login(req.validated.body);
    ok(res, tokens);
  })
);

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10)
  })
});

router.post(
  "/refresh",
  validate(refreshSchema),
  asyncHandler(async (req, res) => {
    const tokens = await AuthService.refresh(req.validated.body.refreshToken);
    ok(res, tokens);
  })
);

router.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req, res) => {
    await AuthService.logout({ sub: req.auth!.sub, subjectType: req.auth!.subjectType });
    ok(res, { loggedOut: true });
  })
);

export default router;
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { ConsentService } from "../services/ConsentService";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const consents = await ConsentService.list(req.auth!.sub);
    ok(res, consents);
  })
);

const postSchema = z.object({
  body: z.object({
    type_consentement: z.string().min(2),
    version_document: z.string().min(1)
  })
});

router.post(
  "/",
  requireAuth,
  validate(postSchema),
  asyncHandler(async (req, res) => {
    const c = await ConsentService.create(req.auth!.sub, req.validated.body);
    ok(res, c);
  })
);

export default router;

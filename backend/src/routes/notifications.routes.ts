import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { NotificationService } from "../services/NotificationService";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const out = await NotificationService.list(req.auth!.sub);
    ok(res, out);
  })
);

const updateSchema = z.object({
  body: z.object({
    lu: z.boolean().optional()
  })
});

router.put(
  "/:id",
  requireAuth,
  validate(updateSchema),
  asyncHandler(async (req, res) => {
    const out = await NotificationService.update(req.auth!.sub, req.params.id, req.validated.body);
    ok(res, out);
  })
);

export default router;
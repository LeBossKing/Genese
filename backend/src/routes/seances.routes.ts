import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { SeanceService } from "../services/SeanceService";
import { FeedbackService } from "../services/FeedbackService";

const router = Router();

router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const out = await SeanceService.getSeance(req.auth!.sub, req.params.id);
    ok(res, out);
  })
);

const feedbackSchema = z.object({
  body: z.object({
    rpe: z.number().int().min(1).max(10),
    douleur_nrs_post: z.number().int().min(0).max(10),
    ressenti_general: z.string().min(2),
    commentaire_libre: z.string().optional()
  })
});

router.post(
  "/:id/feedback",
  requireAuth,
  validate(feedbackSchema),
  asyncHandler(async (req, res) => {
    const out = await FeedbackService.submitFeedback(req.auth!.sub, req.params.id, req.validated.body);
    ok(res, out);
  })
);

export default router;
import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireStaffForExercises } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { ExerciceService } from "../services/ExerciceService";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const out = await ExerciceService.list();
    ok(res, out);
  })
);

const upsertSchema = z.object({
  body: z.object({
    titre: z.string().min(2),
    description: z.string().min(2),
    phase_cible: z.string().min(2),
    zone_cible: z.string().min(2),
    niveau_min: z.number().int(),
    niveau_max: z.number().int(),
    url_video: z.string().min(4),
    duree_recommandee_sec: z.number().int().min(5),
    valide_securite: z.boolean()
  })
});

router.post(
  "/",
  requireAuth,
  requireStaffForExercises,
  validate(upsertSchema),
  asyncHandler(async (req, res) => {
    const out = await ExerciceService.create(req.validated.body);
    ok(res, out);
  })
);

router.put(
  "/:id",
  requireAuth,
  requireStaffForExercises,
  validate(upsertSchema),
  asyncHandler(async (req, res) => {
    const out = await ExerciceService.update(req.params.id, req.validated.body);
    ok(res, out);
  })
);

router.delete(
  "/:id",
  requireAuth,
  requireStaffForExercises,
  asyncHandler(async (req, res) => {
    const out = await ExerciceService.remove(req.params.id);
    ok(res, out);
  })
);

export default router;
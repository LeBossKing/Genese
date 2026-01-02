import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { AlertService } from "../services/AlertService";
import { Role } from "../constants/enums";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    if ([Role.ADMIN, Role.CLINICIAN, Role.COACH].includes(req.auth!.role as any)) {
      const all = await AlertService.listAll();
      return ok(res, all);
    }
    const mine = await AlertService.listForUser(req.auth!.sub);
    ok(res, mine);
  })
);

const updateSchema = z.object({
  body: z.object({
    statut: z.string().optional(),
    details: z.string().optional()
  })
});

router.put(
  "/:id",
  requireAuth,
  requireRole([Role.ADMIN, Role.CLINICIAN, Role.COACH]),
  validate(updateSchema),
  asyncHandler(async (req, res) => {
    const out = await AlertService.update(req.params.id, req.validated.body);
    ok(res, out);
  })
);

export default router;
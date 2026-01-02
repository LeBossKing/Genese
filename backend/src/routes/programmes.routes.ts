import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { ProgramEngine } from "../services/ProgramEngine";
import { ProgrammeService } from "../services/ProgrammeService";

const router = Router();

const genSchema = z.object({
  body: z.object({
    bilan_id: z.string().min(5)
  })
});

router.post(
  "/generate",
  requireAuth,
  validate(genSchema),
  asyncHandler(async (req, res) => {
    const out = await ProgramEngine.generateProgramme(req.auth!.sub, req.validated.body.bilan_id);
    ok(res, out);
  })
);

router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const p = await ProgrammeService.getProgramme(req.auth!.sub, req.params.id);
    ok(res, p);
  })
);

export default router;
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { testsDefinition } from "../constants/testsDefinition";
import { BilanService } from "../services/BilanService";

const router = Router();

router.get(
  "/tests-definition",
  requireAuth,
  asyncHandler(async (_req, res) => {
    ok(res, testsDefinition);
  })
);

const createSchema = z.object({
  body: z.object({
    type_bilan: z.string().min(2),
    date_bilan: z.string().min(8),
    tests: z
      .array(
        z.object({
          type_test: z.string(),
          zone_corps: z.string(),
          amplitude: z.string(),
          fluidite: z.string(),
          sensation: z.string(),
          asymetrie_flag: z.boolean(),
          douleur_nrs: z.number().int().min(0).max(10),
          duree_equilibre_sec: z.number().int().optional()
        })
      )
      .min(1)
  })
});

router.post(
  "/",
  requireAuth,
  validate(createSchema),
  asyncHandler(async (req, res) => {
    const body = req.validated.body;
    const bilan = await BilanService.createBilan(req.auth!.sub, {
      type_bilan: body.type_bilan,
      date_bilan: new Date(body.date_bilan),
      tests: body.tests
    });
    ok(res, bilan);
  })
);

export default router;
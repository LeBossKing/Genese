import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { UserService } from "../services/UserService";

const router = Router();

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = await UserService.getMe(req.auth!.sub);
    ok(res, me);
  })
);

const updateMeSchema = z.object({
  body: z.object({
    prenom: z.string().optional(),
    age: z.number().int().min(10).max(100).optional(),
    genre: z.string().optional(),
    metier: z.string().optional(),
    objectif_principal: z.string().optional(),
    temps_disponible: z.string().optional(),
    lieu_pratique: z.string().optional(),
    niveau_activite: z.string().optional(),
    statut_compte: z.string().optional()
  })
});

router.put(
  "/me",
  requireAuth,
  validate(updateMeSchema),
  asyncHandler(async (req, res) => {
    const me = await UserService.updateMe(req.auth!.sub, req.validated.body);
    ok(res, me);
  })
);

const expDigitaleSchema = z.object({
  body: z.object({
    frequence_telephone: z.string().optional(),
    preference_notification: z.string().optional(),
    duree_attention_max: z.string().optional(),
    contexte_utilisation: z.string().optional()
  })
});

router.put(
  "/me/experience-digitale",
  requireAuth,
  validate(expDigitaleSchema),
  asyncHandler(async (req, res) => {
    const doc = await UserService.upsertExperienceDigitale(req.auth!.sub, req.validated.body);
    ok(res, doc);
  })
);

const expSportiveSchema = z.object({
  body: z.object({
    historique_AP: z.string().optional(),
    niveau_ressenti: z.number().int().min(1).max(10).optional(),
    rapport_douleur: z.string().optional(),
    croyance_principale: z.string().optional(),
    commentaire_croyance: z.string().optional()
  })
});

router.put(
  "/me/experience-sportive",
  requireAuth,
  validate(expSportiveSchema),
  asyncHandler(async (req, res) => {
    const doc = await UserService.upsertExperienceSportive(req.auth!.sub, req.validated.body);
    ok(res, doc);
  })
);

export default router;
import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ok } from "../utils/response";
import { Bilan } from "../models/bilan.model";
import { Programme } from "../models/programme.model";
import { Seance } from "../models/seance.model";
import { FeedbackSeance } from "../models/feedbackSeance.model";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const utilisateur_id = req.auth!.sub;

    const lastBilan = await Bilan.findOne({ utilisateur_id }).sort({ date_bilan: -1 }).lean();
    const programme = await Programme.findOne({ utilisateur_id }).sort({ date_debut: -1 }).lean();

    let adherence = null as any;
    if (programme) {
      const total = await Seance.countDocuments({ programme_id: programme._id });
      const done = await Seance.countDocuments({ programme_id: programme._id, etat: "TERMINEE" });
      const totalMinutes = await Seance.aggregate([
        { $match: { programme_id: programme._id, etat: "TERMINEE" } },
        { $group: { _id: null, sum: { $sum: "$duree_minutes" } } }
      ]);
      const lastFeedback = await FeedbackSeance.findOne({ utilisateur_id }).sort({ date_execution: -1 }).lean();
      adherence = {
        total_seances: total,
        seances_terminees: done,
        taux: total === 0 ? 0 : Number(((done / total) * 100).toFixed(1)),
        temps_total_minutes: totalMinutes[0]?.sum ?? 0,
        last_feedback: lastFeedback ?? null
      };
    }

    ok(res, { last_bilan: lastBilan ?? null, programme_actuel: programme ?? null, adherence });
  })
);

export default router;
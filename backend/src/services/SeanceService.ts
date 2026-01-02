import { Seance } from "../models/seance.model";
import { SeanceExercice } from "../models/seanceExercice.model";
import { Exercice } from "../models/exercice.model";
import { ApiError } from "../utils/apiError";

export class SeanceService {
  static async getSeance(utilisateur_id: string, seance_id: string) {
    const s = await Seance.findById(seance_id).lean();
    if (!s) throw ApiError.notFound("Séance introuvable");

    // ownership via programme -> programme_id is enough if programme belongs to user.
    // To avoid extra query, we accept: caller must only request their ids; still enforce properly:
    // We'll enforce by joining programme in ProgrammeService when needed; here: conservative check omitted.
    // Instead we check by querying programme owner quickly:
    const { Programme } = await import("../models/programme.model");
    const p = await Programme.findById(s.programme_id).lean();
    if (!p) throw ApiError.notFound("Programme introuvable");
    if (p.utilisateur_id !== utilisateur_id) throw ApiError.forbidden();

    const links = await SeanceExercice.find({ seance_id }).sort({ ordre: 1 }).lean();
    const exoIds = links.map((l) => l.exercice_id);
    const exos = await Exercice.find({ _id: { $in: exoIds } }).lean();
    const map = new Map(exos.map((e) => [e._id, e]));

    const exercices = links.map((l) => ({
      ordre: l.ordre,
      duree_sec: l.duree_sec,
      exercice: map.get(l.exercice_id) ?? null
    }));

    return { ...s, exercices };
  }
}
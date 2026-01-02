import { Programme } from "../models/programme.model";
import { ZonePrioritaireProgramme } from "../models/zonePrioritaireProgramme.model";
import { Seance } from "../models/seance.model";
import { ApiError } from "../utils/apiError";
import { thresholds } from "../constants/thresholds";
import { StatutProgramme } from "../constants/enums";

export class ProgrammeService {
  static async getProgramme(utilisateur_id: string, id: string) {
    const p = await Programme.findById(id).lean();
    if (!p) throw ApiError.notFound("Programme introuvable");
    if (p.utilisateur_id !== utilisateur_id) throw ApiError.forbidden();

    const zones = await ZonePrioritaireProgramme.find({ programme_id: id }).lean();
    const seances = await Seance.find({ programme_id: id }).sort({ numero_seance: 1 }).lean();
    return { ...p, zones_prioritaires: zones, seances };
  }

  static async blockAndReduceIntensity(programme_id: string) {
    const p = await Programme.findById(programme_id);
    if (!p) throw ApiError.notFound("Programme introuvable");

    p.statut = StatutProgramme.BLOQUE;
    p.niveau_actuel = Math.max(thresholds.LEVEL_MIN, p.niveau_actuel - 1);
    await p.save();

    await Seance.updateMany({ programme_id, etat: { $ne: "TERMINEE" } }, { $set: { niveau: p.niveau_actuel } });
    return p.toObject();
  }

  static async adjustIntensity(programme_id: string, delta: number) {
    const p = await Programme.findById(programme_id);
    if (!p) throw ApiError.notFound("Programme introuvable");

    const next = Math.min(thresholds.LEVEL_MAX, Math.max(thresholds.LEVEL_MIN, p.niveau_actuel + delta));
    p.niveau_actuel = next;
    await p.save();

    await Seance.updateMany({ programme_id, etat: { $ne: "TERMINEE" } }, { $set: { niveau: next } });
    return p.toObject();
  }
}
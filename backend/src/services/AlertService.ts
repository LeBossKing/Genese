import { AlerteSecurite } from "../models/alerteSecurite.model";
import { StatutAlerte, TypeAlerte } from "../constants/enums";
import { ApiError } from "../utils/apiError";
import { NotificationService } from "./NotificationService";

export class AlertService {
  static async createDouleurCritique(input: { utilisateur_id: string; bilan_id?: string | null; seance_id?: string | null; details: string }) {
    const alert = await AlerteSecurite.create({
      utilisateur_id: input.utilisateur_id,
      bilan_id: input.bilan_id ?? null,
      seance_id: input.seance_id ?? null,
      type_alerte: TypeAlerte.DOULEUR_CRITIQUE,
      statut: StatutAlerte.OUVERTE,
      details: input.details,
      date_declenchement: new Date()
    });

    await NotificationService.notifyAlert(input.utilisateur_id, "Alerte sécurité: douleur critique détectée.");
    return alert.toObject();
  }

  static async listForUser(utilisateur_id: string) {
    return AlerteSecurite.find({ utilisateur_id }).sort({ date_declenchement: -1 }).lean();
  }

  static async listAll() {
    return AlerteSecurite.find({}).sort({ date_declenchement: -1 }).lean();
  }

  static async update(id: string, patch: { statut?: string; details?: string }) {
    const a = await AlerteSecurite.findById(id);
    if (!a) throw ApiError.notFound("Alerte introuvable");

    if (patch.statut) a.statut = patch.statut;
    if (patch.details !== undefined) a.details = patch.details;
    if (patch.statut === StatutAlerte.RESOLUE) a.date_resolution = new Date();

    await a.save();
    return a.toObject();
  }
}
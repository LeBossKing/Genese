import { ApiError } from "../utils/apiError";
import { Utilisateur } from "../models/utilisateur.model";
import { ProfilExperienceDigitale } from "../models/profilExperienceDigitale.model";
import { ProfilExperienceSportive } from "../models/profilExperienceSportive.model";

export class UserService {
  static async getMe(utilisateur_id: string) {
    const user = await Utilisateur.findById(utilisateur_id).lean();
    if (!user) throw ApiError.notFound("Utilisateur introuvable");

    const digitale = await ProfilExperienceDigitale.findOne({ utilisateur_id }).lean();
    const sportive = await ProfilExperienceSportive.findOne({ utilisateur_id }).lean();

    const { mot_de_passe_hash, refresh_token_hash, ...safe } = user as any;
    return { ...safe, experience_digitale: digitale ?? null, experience_sportive: sportive ?? null };
  }

  static async updateMe(utilisateur_id: string, patch: Record<string, unknown>) {
    const allowed = [
      "prenom",
      "age",
      "genre",
      "metier",
      "objectif_principal",
      "temps_disponible",
      "lieu_pratique",
      "niveau_activite",
      "statut_compte"
    ];
    const toSet: any = {};
    for (const k of allowed) if (patch[k] !== undefined) toSet[k] = patch[k];

    if (Object.keys(toSet).length === 0) throw ApiError.badRequest("Aucun champ à mettre à jour");
    await Utilisateur.updateOne({ _id: utilisateur_id }, { $set: toSet });

    return this.getMe(utilisateur_id);
  }

  static async upsertExperienceDigitale(utilisateur_id: string, patch: Record<string, unknown>) {
    await ProfilExperienceDigitale.updateOne(
      { utilisateur_id },
      { $set: { ...patch, utilisateur_id }, $setOnInsert: { date_creation: new Date() } },
      { upsert: true }
    );
    return ProfilExperienceDigitale.findOne({ utilisateur_id }).lean();
  }

  static async upsertExperienceSportive(utilisateur_id: string, patch: Record<string, unknown>) {
    await ProfilExperienceSportive.updateOne(
      { utilisateur_id },
      { $set: { ...patch, utilisateur_id }, $setOnInsert: { date_creation: new Date() } },
      { upsert: true }
    );
    return ProfilExperienceSportive.findOne({ utilisateur_id }).lean();
  }
}
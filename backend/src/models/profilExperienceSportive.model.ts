import mongoose, { Schema } from "mongoose";
import { HistoriqueAP, RapportDouleur, Croyance } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type ProfilExperienceSportiveDoc = {
  _id: string;
  utilisateur_id: string;
  historique_AP?: string;
  niveau_ressenti?: number;
  rapport_douleur?: string;
  croyance_principale?: string;
  commentaire_croyance?: string;
  date_creation: Date;
};

const SchemaDef = new Schema<ProfilExperienceSportiveDoc>(
  {
    _id: { type: String, default: uuid },
    utilisateur_id: { type: String, required: true, unique: true, index: true },

    historique_AP: { type: String, enum: Object.values(HistoriqueAP) },
    niveau_ressenti: { type: Number, min: 1, max: 10 },
    rapport_douleur: { type: String, enum: Object.values(RapportDouleur) },
    croyance_principale: { type: String, enum: Object.values(Croyance) },
    commentaire_croyance: { type: String },

    date_creation: { type: Date, default: () => new Date() }
  },
  { timestamps: true }
);

export const ProfilExperienceSportive = mongoose.model<ProfilExperienceSportiveDoc>(
  "ProfilExperienceSportive",
  SchemaDef
);
import mongoose, { Schema } from "mongoose";
import { TypeBilan, ProfilMoteur } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type BilanDoc = {
  _id: string;
  utilisateur_id: string;
  type_bilan: string;
  date_bilan: Date;
  score_mobilite: number;
  score_stabilite: number;
  score_conscience: number;
  profil_moteur: string;
  commentaire_synthese?: string;
};

const BilanSchema = new Schema<BilanDoc>(
  {
    _id: { type: String, default: uuid },
    utilisateur_id: { type: String, required: true, index: true },
    type_bilan: { type: String, enum: Object.values(TypeBilan), required: true },
    date_bilan: { type: Date, required: true },

    score_mobilite: { type: Number, default: 0 },
    score_stabilite: { type: Number, default: 0 },
    score_conscience: { type: Number, default: 0 },
    profil_moteur: { type: String, enum: Object.values(ProfilMoteur), default: ProfilMoteur.MIXTE },

    commentaire_synthese: { type: String }
  },
  { timestamps: true }
);

BilanSchema.index({ utilisateur_id: 1, date_bilan: -1 });

export const Bilan = mongoose.model<BilanDoc>("Bilan", BilanSchema);
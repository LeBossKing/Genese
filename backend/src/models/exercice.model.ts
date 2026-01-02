import mongoose, { Schema } from "mongoose";
import { PhaseProgramme, ZoneCorps } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type ExerciceDoc = {
  _id: string;
  titre: string;
  description: string;
  phase_cible: string;
  zone_cible: string;
  niveau_min: number;
  niveau_max: number;
  url_video: string;
  duree_recommandee_sec: number;
  valide_securite: boolean;
};

const ExerciceSchema = new Schema<ExerciceDoc>(
  {
    _id: { type: String, default: uuid },
    titre: { type: String, required: true },
    description: { type: String, required: true },
    phase_cible: { type: String, enum: Object.values(PhaseProgramme), required: true },
    zone_cible: { type: String, enum: Object.values(ZoneCorps), required: true },
    niveau_min: { type: Number, required: true },
    niveau_max: { type: Number, required: true },
    url_video: { type: String, required: true },
    duree_recommandee_sec: { type: Number, required: true },
    valide_securite: { type: Boolean, default: true }
  },
  { timestamps: true }
);

ExerciceSchema.index({ phase_cible: 1, zone_cible: 1, niveau_min: 1, niveau_max: 1 });

export const Exercice = mongoose.model<ExerciceDoc>("Exercice", ExerciceSchema);
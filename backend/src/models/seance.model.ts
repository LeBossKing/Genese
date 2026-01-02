import mongoose, { Schema } from "mongoose";
import { PhaseProgramme, TypeSeance, EtatSeance } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type SeanceDoc = {
  _id: string;
  programme_id: string;
  phase: string;
  numero_seance: number;
  duree_minutes: number;
  niveau: number;
  type_seance: string;
  etat: string;
};

const SeanceSchema = new Schema<SeanceDoc>(
  {
    _id: { type: String, default: uuid },
    programme_id: { type: String, required: true, index: true },
    phase: { type: String, enum: Object.values(PhaseProgramme), required: true },
    numero_seance: { type: Number, required: true },
    duree_minutes: { type: Number, default: 20 },
    niveau: { type: Number, default: 4 },
    type_seance: { type: String, enum: Object.values(TypeSeance), default: TypeSeance.ENTRAINEMENT },
    etat: { type: String, enum: Object.values(EtatSeance), default: EtatSeance.A_FAIRE }
  },
  { timestamps: true }
);

SeanceSchema.index({ programme_id: 1, numero_seance: 1 }, { unique: true });

export const Seance = mongoose.model<SeanceDoc>("Seance", SeanceSchema);
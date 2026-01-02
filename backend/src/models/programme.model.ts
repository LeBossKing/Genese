import mongoose, { Schema } from "mongoose";
import { FocusProgramme, StatutProgramme } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type ProgrammeDoc = {
  _id: string;
  utilisateur_id: string;
  bilan_initial_id: string;
  date_debut: Date;
  duree_semaines: number;
  focus_actuel: string;
  duree_phase1_semaines: number;
  duree_phase2_semaines: number;
  duree_phase3_semaines: number;
  niveau_actuel: number;
  statut: string;
};

const ProgrammeSchema = new Schema<ProgrammeDoc>(
  {
    _id: { type: String, default: uuid },
    utilisateur_id: { type: String, required: true, index: true },
    bilan_initial_id: { type: String, required: true, index: true },
    date_debut: { type: Date, default: () => new Date() },
    duree_semaines: { type: Number, default: 6 },
    focus_actuel: { type: String, enum: Object.values(FocusProgramme), required: true },
    duree_phase1_semaines: { type: Number, default: 2 },
    duree_phase2_semaines: { type: Number, default: 2 },
    duree_phase3_semaines: { type: Number, default: 2 },
    niveau_actuel: { type: Number, default: 4 },
    statut: { type: String, enum: Object.values(StatutProgramme), default: StatutProgramme.ACTIF }
  },
  { timestamps: true }
);

ProgrammeSchema.index({ utilisateur_id: 1, date_debut: -1 });

export const Programme = mongoose.model<ProgrammeDoc>("Programme", ProgrammeSchema);
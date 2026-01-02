import mongoose, { Schema } from "mongoose";
import { uuid } from "../utils/uuid";

export type SeanceExerciceDoc = {
  _id: string;
  seance_id: string;
  exercice_id: string;
  ordre: number;
  duree_sec: number;
};

const SeanceExerciceSchema = new Schema<SeanceExerciceDoc>(
  {
    _id: { type: String, default: uuid },
    seance_id: { type: String, required: true, index: true },
    exercice_id: { type: String, required: true, index: true },
    ordre: { type: Number, required: true },
    duree_sec: { type: Number, required: true }
  },
  { timestamps: true }
);

SeanceExerciceSchema.index({ seance_id: 1, ordre: 1 }, { unique: true });

export const SeanceExercice = mongoose.model<SeanceExerciceDoc>("SeanceExercice", SeanceExerciceSchema);
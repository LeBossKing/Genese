import mongoose, { Schema } from "mongoose";
import { Ressenti } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type FeedbackSeanceDoc = {
  _id: string;
  seance_id: string;
  utilisateur_id: string;
  date_execution: Date;
  rpe: number;
  douleur_nrs_post: number;
  ressenti_general: string;
  commentaire_libre?: string;
};

const FeedbackSeanceSchema = new Schema<FeedbackSeanceDoc>(
  {
    _id: { type: String, default: uuid },
    seance_id: { type: String, required: true, index: true },
    utilisateur_id: { type: String, required: true, index: true },
    date_execution: { type: Date, default: () => new Date() },
    rpe: { type: Number, min: 1, max: 10, required: true },
    douleur_nrs_post: { type: Number, min: 0, max: 10, required: true },
    ressenti_general: { type: String, enum: Object.values(Ressenti), required: true },
    commentaire_libre: { type: String }
  },
  { timestamps: true }
);

FeedbackSeanceSchema.index({ seance_id: 1, utilisateur_id: 1, date_execution: -1 });

export const FeedbackSeance = mongoose.model<FeedbackSeanceDoc>("FeedbackSeance", FeedbackSeanceSchema);
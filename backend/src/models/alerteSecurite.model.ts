import mongoose, { Schema } from "mongoose";
import { TypeAlerte, StatutAlerte } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type AlerteSecuriteDoc = {
  _id: string;
  utilisateur_id: string;
  seance_id?: string | null;
  bilan_id?: string | null;
  type_alerte: string;
  date_declenchement: Date;
  statut: string;
  details?: string;
  date_resolution?: Date | null;
};

const AlerteSecuriteSchema = new Schema<AlerteSecuriteDoc>(
  {
    _id: { type: String, default: uuid },
    utilisateur_id: { type: String, required: true, index: true },
    seance_id: { type: String, default: null, index: true },
    bilan_id: { type: String, default: null, index: true },
    type_alerte: { type: String, enum: Object.values(TypeAlerte), required: true },
    date_declenchement: { type: Date, default: () => new Date() },
    statut: { type: String, enum: Object.values(StatutAlerte), default: StatutAlerte.OUVERTE },
    details: { type: String, default: "" },
    date_resolution: { type: Date, default: null }
  },
  { timestamps: true }
);

AlerteSecuriteSchema.index({ utilisateur_id: 1, date_declenchement: -1 });

export const AlerteSecurite = mongoose.model<AlerteSecuriteDoc>("AlerteSecurite", AlerteSecuriteSchema);
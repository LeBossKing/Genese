import mongoose, { Schema } from "mongoose";
import { TypeConsentement } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type ConsentementDoc = {
  _id: string;
  utilisateur_id: string;
  type_consentement: string;
  version_document: string;
  date_acceptation: Date;
};

const ConsentementSchema = new Schema<ConsentementDoc>(
  {
    _id: { type: String, default: uuid },
    utilisateur_id: { type: String, required: true, index: true },
    type_consentement: { type: String, enum: Object.values(TypeConsentement), required: true },
    version_document: { type: String, required: true },
    date_acceptation: { type: Date, default: () => new Date() }
  },
  { timestamps: true }
);

ConsentementSchema.index({ utilisateur_id: 1, type_consentement: 1, version_document: 1 }, { unique: true });

export const Consentement = mongoose.model<ConsentementDoc>("Consentement", ConsentementSchema);
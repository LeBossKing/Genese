import mongoose, { Schema } from "mongoose";
import { Role } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type AdministrateurDoc = {
  _id: string;
  email: string;
  mot_de_passe_hash: string;
  role: string;
  refresh_token_hash?: string | null;
};

const AdministrateurSchema = new Schema<AdministrateurDoc>(
  {
    _id: { type: String, default: uuid },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    mot_de_passe_hash: { type: String, required: true },
    role: { type: String, enum: [Role.ADMIN, Role.CLINICIAN, Role.COACH], required: true },
    refresh_token_hash: { type: String, default: null }
  },
  { timestamps: true }
);

export const Administrateur = mongoose.model<AdministrateurDoc>("Administrateur", AdministrateurSchema);
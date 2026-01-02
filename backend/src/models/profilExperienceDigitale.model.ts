import mongoose, { Schema } from "mongoose";
import { FrequenceTel, PreferenceNotif, DureeAttention, Contexte } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type ProfilExperienceDigitaleDoc = {
  _id: string;
  utilisateur_id: string;
  frequence_telephone?: string;
  preference_notification?: string;
  duree_attention_max?: string;
  contexte_utilisation?: string;
  date_creation: Date;
};

const SchemaDef = new Schema<ProfilExperienceDigitaleDoc>(
  {
    _id: { type: String, default: uuid },
    utilisateur_id: { type: String, required: true, unique: true, index: true },

    frequence_telephone: { type: String, enum: Object.values(FrequenceTel) },
    preference_notification: { type: String, enum: Object.values(PreferenceNotif) },
    duree_attention_max: { type: String, enum: Object.values(DureeAttention) },
    contexte_utilisation: { type: String, enum: Object.values(Contexte) },

    date_creation: { type: Date, default: () => new Date() }
  },
  { timestamps: true }
);

export const ProfilExperienceDigitale = mongoose.model<ProfilExperienceDigitaleDoc>(
  "ProfilExperienceDigitale",
  SchemaDef
);
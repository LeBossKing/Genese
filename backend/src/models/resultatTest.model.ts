import mongoose, { Schema } from "mongoose";
import { TypeTest, ZoneCorps, Amplitude, Fluidite, Sensation } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type ResultatTestDoc = {
  _id: string;
  bilan_id: string;
  type_test: string;
  zone_corps: string;
  amplitude: string;
  fluidite: string;
  sensation: string;
  asymetrie_flag: boolean;
  douleur_nrs: number;
  duree_equilibre_sec?: number;
};

const ResultatTestSchema = new Schema<ResultatTestDoc>(
  {
    _id: { type: String, default: uuid },
    bilan_id: { type: String, required: true, index: true },
    type_test: { type: String, enum: Object.values(TypeTest), required: true },
    zone_corps: { type: String, enum: Object.values(ZoneCorps), required: true },
    amplitude: { type: String, enum: Object.values(Amplitude), required: true },
    fluidite: { type: String, enum: Object.values(Fluidite), required: true },
    sensation: { type: String, enum: Object.values(Sensation), required: true },
    asymetrie_flag: { type: Boolean, required: true },
    douleur_nrs: { type: Number, min: 0, max: 10, required: true },
    duree_equilibre_sec: { type: Number }
  },
  { timestamps: true }
);

ResultatTestSchema.index({ bilan_id: 1, type_test: 1 });

export const ResultatTest = mongoose.model<ResultatTestDoc>("ResultatTest", ResultatTestSchema);
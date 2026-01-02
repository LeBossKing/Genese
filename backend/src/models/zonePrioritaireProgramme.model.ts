import mongoose, { Schema } from "mongoose";
import { ZoneCorps } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type ZonePrioritaireProgrammeDoc = {
  _id: string;
  programme_id: string;
  zone_corps: string;
  importance: number;
};

const ZonePrioritaireProgrammeSchema = new Schema<ZonePrioritaireProgrammeDoc>(
  {
    _id: { type: String, default: uuid },
    programme_id: { type: String, required: true, index: true },
    zone_corps: { type: String, enum: Object.values(ZoneCorps), required: true },
    importance: { type: Number, default: 1 }
  },
  { timestamps: true }
);

ZonePrioritaireProgrammeSchema.index({ programme_id: 1, zone_corps: 1 }, { unique: true });

export const ZonePrioritaireProgramme = mongoose.model<ZonePrioritaireProgrammeDoc>(
  "ZonePrioritaireProgramme",
  ZonePrioritaireProgrammeSchema
);
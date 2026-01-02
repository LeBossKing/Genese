import mongoose, { Schema } from "mongoose";
import { TypeNotification, Canal } from "../constants/enums";
import { uuid } from "../utils/uuid";

export type NotificationDoc = {
  _id: string;
  utilisateur_id: string;
  type_notification: string;
  message: string;
  date_envoi: Date;
  canal: string;
  lu: boolean;
};

const NotificationSchema = new Schema<NotificationDoc>(
  {
    _id: { type: String, default: uuid },
    utilisateur_id: { type: String, required: true, index: true },
    type_notification: { type: String, enum: Object.values(TypeNotification), required: true },
    message: { type: String, required: true },
    date_envoi: { type: Date, default: () => new Date() },
    canal: { type: String, enum: Object.values(Canal), default: Canal.IN_APP },
    lu: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification = mongoose.model<NotificationDoc>("Notification", NotificationSchema);
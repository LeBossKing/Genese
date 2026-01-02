import { Notification } from "../models/notification.model";
import { TypeNotification, Canal } from "../constants/enums";
import { ApiError } from "../utils/apiError";

export class NotificationService {
  static async create(utilisateur_id: string, input: { type: string; message: string }) {
    return Notification.create({
      utilisateur_id,
      type_notification: input.type,
      message: input.message,
      canal: Canal.IN_APP,
      date_envoi: new Date(),
      lu: false
    });
  }

  static async list(utilisateur_id: string) {
    return Notification.find({ utilisateur_id }).sort({ date_envoi: -1 }).lean();
  }

  static async update(utilisateur_id: string, id: string, patch: { lu?: boolean }) {
    const n = await Notification.findById(id);
    if (!n) throw ApiError.notFound("Notification introuvable");
    if (n.utilisateur_id !== utilisateur_id) throw ApiError.forbidden();

    if (patch.lu !== undefined) n.lu = patch.lu;
    await n.save();
    return n.toObject();
  }

  static async notifyAlert(utilisateur_id: string, message: string) {
    return this.create(utilisateur_id, { type: TypeNotification.ALERT, message });
  }
}
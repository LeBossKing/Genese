import { Consentement } from "../models/consentement.model";

export class ConsentService {
  static async list(utilisateur_id: string) {
    return Consentement.find({ utilisateur_id }).sort({ date_acceptation: -1 }).lean();
  }

  static async create(utilisateur_id: string, input: { type_consentement: string; version_document: string }) {
    const doc = await Consentement.create({
      utilisateur_id,
      type_consentement: input.type_consentement,
      version_document: input.version_document,
      date_acceptation: new Date()
    });
    return doc.toObject();
  }
}
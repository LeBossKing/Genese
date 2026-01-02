import { Exercice } from "../models/exercice.model";
import { ApiError } from "../utils/apiError";

export class ExerciceService {
  static async list() {
    return Exercice.find({}).sort({ createdAt: -1 }).lean();
  }

  static async create(input: any) {
    const e = await Exercice.create(input);
    return e.toObject();
  }

  static async update(id: string, input: any) {
    const e = await Exercice.findById(id);
    if (!e) throw ApiError.notFound("Exercice introuvable");
    Object.assign(e, input);
    await e.save();
    return e.toObject();
  }

  static async remove(id: string) {
    const e = await Exercice.findById(id);
    if (!e) throw ApiError.notFound("Exercice introuvable");
    await e.deleteOne();
    return { deleted: true };
  }
}
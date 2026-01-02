import { FeedbackSeance } from "../models/feedbackSeance.model";
import { Seance } from "../models/seance.model";
import { ApiError } from "../utils/apiError";
import { thresholds } from "../constants/thresholds";
import { AlertService } from "./AlertService";
import { ProgrammeService } from "./ProgrammeService";
import { NotificationService } from "./NotificationService";
import { EtatSeance, StatutProgramme, TypeNotification } from "../constants/enums";
import { Programme } from "../models/programme.model";

export class FeedbackService {
  static async submitFeedback(utilisateur_id: string, seance_id: string, input: any) {
    const seance = await Seance.findById(seance_id);
    if (!seance) throw ApiError.notFound("Séance introuvable");

    const programme = await Programme.findById(seance.programme_id);
    if (!programme) throw ApiError.notFound("Programme introuvable");
    if (programme.utilisateur_id !== utilisateur_id) throw ApiError.forbidden();

    const fb = await FeedbackSeance.create({
      seance_id,
      utilisateur_id,
      date_execution: new Date(),
      rpe: input.rpe,
      douleur_nrs_post: input.douleur_nrs_post,
      ressenti_general: input.ressenti_general,
      commentaire_libre: input.commentaire_libre ?? ""
    });

    seance.etat = EtatSeance.TERMINEE;
    await seance.save();

    // Business rules (sequence):
    // - if douleur >=6 => alert + programme BLOQUE + reduce intensity
    if (input.douleur_nrs_post >= thresholds.FEEDBACK_DOULEUR_CRITIQUE) {
      await AlertService.createDouleurCritique({
        utilisateur_id,
        seance_id,
        bilan_id: null,
        details: "Douleur NRS critique post-séance (>=6). Programme bloqué."
      });
      const updatedProgramme = await ProgrammeService.blockAndReduceIntensity(programme._id);
      await NotificationService.create(utilisateur_id, {
        type: TypeNotification.INFO,
        message: "Programme bloqué par sécurité. Nous recommandons de consulter un professionnel de santé."
      });
      return {
        feedback: fb.toObject(),
        adaptation: { statut_programme: StatutProgramme.BLOQUE, niveau_actuel: updatedProgramme.niveau_actuel, recommandations: ["Consultez un professionnel de santé."] }
      };
    }

    // else: adapt intensity using RPE thresholds (+ moderate pain)
    let delta = 0;
    if (input.rpe >= thresholds.RPE_HIGH || input.douleur_nrs_post >= thresholds.PAIN_MODERATE) delta = -1;
    else if (input.rpe <= thresholds.RPE_LOW && input.douleur_nrs_post <= 2) delta = +1;

    if (delta !== 0) {
      const updatedProgramme = await ProgrammeService.adjustIntensity(programme._id, delta);
      await NotificationService.create(utilisateur_id, {
        type: TypeNotification.INFO,
        message: delta < 0 ? "Intensité ajustée à la baisse pour la prochaine séance." : "Intensité augmentée pour progresser."
      });
      return {
        feedback: fb.toObject(),
        adaptation: {
          statut_programme: updatedProgramme.statut,
          niveau_actuel: updatedProgramme.niveau_actuel,
          recommandations: delta < 0 ? ["Réduire l'intensité", "Concentrez-vous sur la qualité du mouvement"] : ["Augmenter légèrement l'intensité", "Gardez un rythme confortable"]
        }
      };
    }

    return {
      feedback: fb.toObject(),
      adaptation: {
        statut_programme: programme.statut,
        niveau_actuel: programme.niveau_actuel,
        recommandations: ["Continuez ainsi"]
      }
    };
  }
}
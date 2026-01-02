import { Bilan } from "../models/bilan.model";
import { ResultatTest } from "../models/resultatTest.model";
import { ApiError } from "../utils/apiError";
import { ProfilMoteur, TypeTest } from "../constants/enums";
import { thresholds } from "../constants/thresholds";
import {AlerteService} from './AlertService';

function scoreFrom3Levels(v: string) {
  // FAIBLE=3, MOYENNE=6, BONNE=9
  if (v === "FAIBLE") return 3;
  if (v === "MOYENNE") return 6;
  return 9;
}

function scoreFromSensation(v: string) {
  // INCONFORT=3, NEUTRE=6, BONNE=9
  if (v === "INCONFORT") return 3;
  if (v === "NEUTRE") return 6;
  return 9;
}

function computeCategoryScore(tests: any[]) {
  if (tests.length === 0) return 0;
  const raw = tests.map((t) => (scoreFrom3Levels(t.amplitude) + scoreFrom3Levels(t.fluidite) + scoreFromSensation(t.sensation)) / 3);
  const avg = raw.reduce((a, b) => a + b, 0) / raw.length;
  // pain penalty: -0.5 per pain point above 0
  const painAvg = tests.reduce((a, t) => a + (t.douleur_nrs ?? 0), 0) / tests.length;
  const penalized = Math.max(0, avg - 0.5 * painAvg);
  return Number(penalized.toFixed(2));
}

function computeProfil(scores: { m: number; s: number; c: number }) {
  const entries = [
    { k: ProfilMoteur.MOBILITE, v: scores.m },
    { k: ProfilMoteur.STABILITE, v: scores.s },
    { k: ProfilMoteur.CONSCIENCE, v: scores.c }
  ].sort((a, b) => a.v - b.v);
  const min = entries[0];
  const second = entries[1];
  if (second.v - min.v < 0.75) return ProfilMoteur.MIXTE;
  return min.k;
}

export class BilanService {
  static async createBilan(utilisateur_id: string, input: { type_bilan: string; date_bilan: Date; tests: any[] }) {
    if (!input.tests || input.tests.length === 0) throw ApiError.badRequest("Aucun test fourni");

    const byType = (type: string) => input.tests.filter((t) => t.type_test === type);

    const score_mobilite = computeCategoryScore(byType(TypeTest.MOBILITE));
    const score_stabilite = computeCategoryScore(byType(TypeTest.STABILITE));
    const score_conscience = computeCategoryScore(byType(TypeTest.CONSCIENCE));
    const profil_moteur = computeProfil({ m: score_mobilite, s: score_stabilite, c: score_conscience });

    const bilan = await Bilan.create({
      utilisateur_id,
      type_bilan: input.type_bilan,
      date_bilan: input.date_bilan,
      score_mobilite,
      score_stabilite,
      score_conscience,
      profil_moteur,
      commentaire_synthese: "Synthèse auto-générée"
    });

    await ResultatTest.insertMany(
      input.tests.map((t) => ({
        bilan_id: bilan._id,
        ...t
      }))
    );

    const painCritical = input.tests.some((t) => (t.douleur_nrs ?? 0) >= thresholds.BILAN_DOULEUR_CRITIQUE);
    if (painCritical) {
      await AlertService.createDouleurCritique({
        utilisateur_id,
        bilan_id: bilan._id,
        seance_id: null,
        details: "Douleur NRS critique détectée lors du bilan (>=7)."
      });
    }

    return {
      ...(bilan.toObject() as any),
      tests_count: input.tests.length
    };
  }

  static async getLatestBilan(utilisateur_id: string) {
    const b = await Bilan.findOne({ utilisateur_id }).sort({ date_bilan: -1 }).lean();
    if (!b) throw ApiError.notFound("Aucun bilan");
    return b;
  }
}
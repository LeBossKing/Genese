import { Exercice } from "../models/exercice.model";
import { ZonePrioritaireProgramme } from "../models/zonePrioritaireProgramme.model";
import { Seance } from "../models/seance.model";
import { SeanceExercice } from "../models/seanceExercice.model";
import { thresholds } from "../constants/thresholds";
import {
  FocusProgramme,
  NiveauActivite,
  PhaseProgramme,
  StatutProgramme,
  TypeTest,
  ZoneCorps
} from "../constants/enums";
import type { ProgrammeDoc } from "../models/programme.model";
import { Programme } from "../models/programme.model";
import { ResultatTest } from "../models/resultatTest.model";
import { Utilisateur } from "../models/utilisateur.model";
import { Bilan } from "../models/bilan.model";
import { ApiError } from "../utils/apiError";

function pickInitialLevel(niveau_activite?: string) {
  if (niveau_activite === NiveauActivite.INACTIF) return 2;
  if (niveau_activite === NiveauActivite.SEDENTAIRE) return 4;
  if (niveau_activite === NiveauActivite.ACTIF) return 6;
  return 4;
}

function pickFocusFromBilan(bilan: any) {
  const arr = [
    { k: FocusProgramme.MOBILITE, v: bilan.score_mobilite },
    { k: FocusProgramme.STABILITE, v: bilan.score_stabilite },
    { k: FocusProgramme.CONSCIENCE, v: bilan.score_conscience }
  ].sort((a, b) => a.v - b.v);
  return arr[0].k;
}

function computeZonesPrioritaires(resultats: any[]) {
  // heuristic: zones with highest pain + asymmetry get higher importance
  const map = new Map<string, number>();
  for (const r of resultats) {
    const z = r.zone_corps;
    const base = (r.douleur_nrs ?? 0) + (r.asymetrie_flag ? 2 : 0);
    map.set(z, (map.get(z) ?? 0) + base);
  }
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (sorted.length === 0) return [{ zone_corps: ZoneCorps.RACHIS, importance: 1 }];
  const max = sorted[0][1] || 1;
  return sorted.map(([zone, val]) => ({ zone_corps: zone, importance: Math.max(1, Math.round((3 * val) / max)) }));
}

function phaseForIndex(i: number, p1: number, p2: number) {
  if (i <= p1) return PhaseProgramme.PHASE_1;
  if (i <= p1 + p2) return PhaseProgramme.PHASE_2;
  return PhaseProgramme.PHASE_3;
}

export class ProgramEngine {
  static async generateProgramme(utilisateur_id: string, bilan_id: string) {
    const user = await Utilisateur.findById(utilisateur_id).lean();
    if (!user) throw ApiError.notFound("Utilisateur introuvable");

    const bilan = await Bilan.findById(bilan_id).lean();
    if (!bilan || bilan.utilisateur_id !== utilisateur_id) throw ApiError.notFound("Bilan introuvable");

    const resultats = await ResultatTest.find({ bilan_id }).lean();

    const focus = pickFocusFromBilan(bilan);
    const niveau_initial = Math.min(thresholds.LEVEL_MAX, Math.max(thresholds.LEVEL_MIN, pickInitialLevel(user.niveau_activite)));

    const duree_semaines = 6;
    const duree_phase1_semaines = 2;
    const duree_phase2_semaines = 2;
    const duree_phase3_semaines = 2;

    const programme = await Programme.create({
      utilisateur_id,
      bilan_initial_id: bilan_id,
      date_debut: new Date(),
      duree_semaines,
      focus_actuel: focus,
      duree_phase1_semaines,
      duree_phase2_semaines,
      duree_phase3_semaines,
      niveau_actuel: niveau_initial,
      statut: StatutProgramme.ACTIF
    });

    // zones prioritaires
    const zones = computeZonesPrioritaires(resultats);
    await ZonePrioritaireProgramme.insertMany(
      zones.map((z) => ({ programme_id: programme._id, zone_corps: z.zone_corps, importance: z.importance }))
    );

    // seances: 3 per week
    const totalSeances = duree_semaines * 3;
    const p1Seances = duree_phase1_semaines * 3;
    const p2Seances = duree_phase2_semaines * 3;

    const seances = await Seance.insertMany(
      Array.from({ length: totalSeances }).map((_, idx) => ({
        programme_id: programme._id,
        numero_seance: idx + 1,
        phase: phaseForIndex(idx + 1, p1Seances, p2Seances),
        duree_minutes: user.temps_disponible === "MOINS_10" ? 10 : 20,
        niveau: niveau_initial,
        type_seance: "ENTRAINEMENT",
        etat: "A_FAIRE"
      }))
    );

    // build seance exercises
    const phaseToZoneWeights = zones; // use zones in all phases
    for (const s of seances) {
      const phase = (s as any).phase as string;
      const chosenZone = phaseToZoneWeights[0]?.zone_corps ?? ZoneCorps.RACHIS;

      const exos = await Exercice.find({
        phase_cible: phase,
        zone_cible: chosenZone,
        valide_securite: true,
        niveau_min: { $lte: niveau_initial },
        niveau_max: { $gte: niveau_initial }
      })
        .limit(5)
        .lean();

      // fallback: any zone
      const finalExos =
        exos.length >= 3
          ? exos
          : await Exercice.find({
              phase_cible: phase,
              valide_securite: true,
              niveau_min: { $lte: niveau_initial },
              niveau_max: { $gte: niveau_initial }
            })
              .limit(5)
              .lean();

      await SeanceExercice.insertMany(
        finalExos.slice(0, 5).map((e, i) => ({
          seance_id: (s as any)._id,
          exercice_id: e._id,
          ordre: i + 1,
          duree_sec: e.duree_recommandee_sec
        }))
      );
    }

    const firstSeance = seances[0] ? (seances[0] as any)._id : null;
    return { programme: programme.toObject(), premiere_seance_id: firstSeance };
  }
}
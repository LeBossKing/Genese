export const SubjectType = {
  USER: "USER",
  ADMIN: "ADMIN"
} as const;
export type SubjectType = (typeof SubjectType)[keyof typeof SubjectType];

export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
  CLINICIAN: "CLINICIAN",
  COACH: "COACH"
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const Genre = {
  HOMME: "HOMME",
  FEMME: "FEMME",
  AUTRE: "AUTRE"
} as const;
export type Genre = (typeof Genre)[keyof typeof Genre];

export const Objectif = {
  DOULEUR: "DOULEUR",
  MOBILITE: "MOBILITE",
  PERFORMANCE: "PERFORMANCE",
  BIEN_ETRE: "BIEN_ETRE"
} as const;
export type Objectif = (typeof Objectif)[keyof typeof Objectif];

export const TempsDispo = {
  MOINS_10: "MOINS_10",
  DIX_20: "DIX_20",
  VINGT_30: "VINGT_30",
  PLUS_30: "PLUS_30"
} as const;
export type TempsDispo = (typeof TempsDispo)[keyof typeof TempsDispo];

export const LieuPratique = {
  MAISON: "MAISON",
  SALLE: "SALLE",
  EXTERIEUR: "EXTERIEUR"
} as const;
export type LieuPratique = (typeof LieuPratique)[keyof typeof LieuPratique];

export const NiveauActivite = {
  INACTIF: "INACTIF",
  SEDENTAIRE: "SEDENTAIRE",
  ACTIF: "ACTIF"
} as const;
export type NiveauActivite = (typeof NiveauActivite)[keyof typeof NiveauActivite];

export const StatutCompte = {
  EN_ATTENTE: "EN_ATTENTE",
  ACTIF: "ACTIF",
  SUSPENDU: "SUSPENDU"
} as const;
export type StatutCompte = (typeof StatutCompte)[keyof typeof StatutCompte];

export const FrequenceTel = {
  FAIBLE: "FAIBLE",
  MOYENNE: "MOYENNE",
  ELEVEE: "ELEVEE"
} as const;
export type FrequenceTel = (typeof FrequenceTel)[keyof typeof FrequenceTel];

export const PreferenceNotif = {
  FAIBLE: "FAIBLE",
  MOYENNE: "MOYENNE",
  ELEVEE: "ELEVEE"
} as const;
export type PreferenceNotif = (typeof PreferenceNotif)[keyof typeof PreferenceNotif];

export const DureeAttention = {
  COURTE: "COURTE",
  MOYENNE: "MOYENNE",
  LONGUE: "LONGUE"
} as const;
export type DureeAttention = (typeof DureeAttention)[keyof typeof DureeAttention];

export const Contexte = {
  CALME: "CALME",
  BRUIT: "BRUIT",
  TRANSPORT: "TRANSPORT"
} as const;
export type Contexte = (typeof Contexte)[keyof typeof Contexte];

export const HistoriqueAP = {
  DEBUTANT: "DEBUTANT",
  INTERMEDIAIRE: "INTERMEDIAIRE",
  AVANCE: "AVANCE"
} as const;
export type HistoriqueAP = (typeof HistoriqueAP)[keyof typeof HistoriqueAP];

export const RapportDouleur = {
  AUCUNE: "AUCUNE",
  OCCASIONNELLE: "OCCASIONNELLE",
  FREQUENTE: "FREQUENTE",
  CHRONIQUE: "CHRONIQUE"
} as const;
export type RapportDouleur = (typeof RapportDouleur)[keyof typeof RapportDouleur];

export const Croyance = {
  PEUR_MOUVEMENT: "PEUR_MOUVEMENT",
  FRAGILITE: "FRAGILITE",
  MANQUE_TEMPS: "MANQUE_TEMPS",
  AUTRE: "AUTRE"
} as const;
export type Croyance = (typeof Croyance)[keyof typeof Croyance];

export const TypeBilan = {
  AUTO_COMPLET: "AUTO_COMPLET"
} as const;
export type TypeBilan = (typeof TypeBilan)[keyof typeof TypeBilan];

export const TypeTest = {
  MOBILITE: "MOBILITE",
  STABILITE: "STABILITE",
  CONSCIENCE: "CONSCIENCE"
} as const;
export type TypeTest = (typeof TypeTest)[keyof typeof TypeTest];

export const ZoneCorps = {
  RACHIS: "RACHIS",
  EPAULE: "EPAULE",
  HANCHE: "HANCHE",
  GENOU: "GENOU",
  CHEVILLE: "CHEVILLE"
} as const;
export type ZoneCorps = (typeof ZoneCorps)[keyof typeof ZoneCorps];

export const Amplitude = {
  FAIBLE: "FAIBLE",
  MOYENNE: "MOYENNE",
  BONNE: "BONNE"
} as const;
export type Amplitude = (typeof Amplitude)[keyof typeof Amplitude];

export const Fluidite = {
  FAIBLE: "FAIBLE",
  MOYENNE: "MOYENNE",
  BONNE: "BONNE"
} as const;
export type Fluidite = (typeof Fluidite)[keyof typeof Fluidite];

export const Sensation = {
  INCONFORT: "INCONFORT",
  NEUTRE: "NEUTRE",
  BONNE: "BONNE"
} as const;
export type Sensation = (typeof Sensation)[keyof typeof Sensation];

export const ProfilMoteur = {
  MOBILITE: "MOBILITE",
  STABILITE: "STABILITE",
  CONSCIENCE: "CONSCIENCE",
  MIXTE: "MIXTE"
} as const;
export type ProfilMoteur = (typeof ProfilMoteur)[keyof typeof ProfilMoteur];

export const FocusProgramme = {
  MOBILITE: "MOBILITE",
  STABILITE: "STABILITE",
  CONSCIENCE: "CONSCIENCE"
} as const;
export type FocusProgramme = (typeof FocusProgramme)[keyof typeof FocusProgramme];

export const PhaseProgramme = {
  PHASE_1: "PHASE_1",
  PHASE_2: "PHASE_2",
  PHASE_3: "PHASE_3"
} as const;
export type PhaseProgramme = (typeof PhaseProgramme)[keyof typeof PhaseProgramme];

export const StatutProgramme = {
  ACTIF: "ACTIF",
  BLOQUE: "BLOQUE",
  TERMINE: "TERMINE"
} as const;
export type StatutProgramme = (typeof StatutProgramme)[keyof typeof StatutProgramme];

export const TypeSeance = {
  ENTRAINEMENT: "ENTRAINEMENT"
} as const;
export type TypeSeance = (typeof TypeSeance)[keyof typeof TypeSeance];

export const EtatSeance = {
  A_FAIRE: "A_FAIRE",
  EN_COURS: "EN_COURS",
  TERMINEE: "TERMINEE"
} as const;
export type EtatSeance = (typeof EtatSeance)[keyof typeof EtatSeance];

export const Ressenti = {
  FACILE: "FACILE",
  OK: "OK",
  DIFFICILE: "DIFFICILE"
} as const;
export type Ressenti = (typeof Ressenti)[keyof typeof Ressenti];

export const TypeAlerte = {
  DOULEUR_CRITIQUE: "DOULEUR_CRITIQUE"
} as const;
export type TypeAlerte = (typeof TypeAlerte)[keyof typeof TypeAlerte];

export const StatutAlerte = {
  OUVERTE: "OUVERTE",
  RESOLUE: "RESOLUE"
} as const;
export type StatutAlerte = (typeof StatutAlerte)[keyof typeof StatutAlerte];

export const TypeConsentement = {
  CGU: "CGU",
  RGPD: "RGPD"
} as const;
export type TypeConsentement = (typeof TypeConsentement)[keyof typeof TypeConsentement];

export const TypeNotification = {
  ALERT: "ALERT",
  ADHERENCE: "ADHERENCE",
  INFO: "INFO"
} as const;
export type TypeNotification = (typeof TypeNotification)[keyof typeof TypeNotification];

export const Canal = {
  IN_APP: "IN_APP"
} as const;
export type Canal = (typeof Canal)[keyof typeof Canal];
import { ApiResponse } from "./http";

export type Genre = "HOMME" | "FEMME" | "AUTRE";
export type Objectif = "MOBILITE" | "DOULEUR" | "FORCE" | "ENDURANCE" | "POSTURE";
export type TempsDispo = "MOINS_10" | "DIX_20" | "VINGT_30" | "PLUS_30";
export type LieuPratique = "MAISON" | "SALLE" | "EXTERIEUR";
export type NiveauActivite = "INACTIF" | "SEDENTAIRE" | "ACTIF";

export type SignupReq = { email: string; mot_de_passe: string; prenom: string };
export type LoginReq = { email: string; mot_de_passe: string };
export type AuthRes = { utilisateur?: any; administrateur?: any; accessToken: string; refreshToken: string };

export type UpdateMeReq = Partial<{
  prenom: string;
  age: number;
  genre: Genre;
  metier: string;
  objectif_principal: Objectif;
  temps_disponible: TempsDispo;
  lieu_pratique: LieuPratique;
  niveau_activite: NiveauActivite;
  statut_compte: "ACTIF" | "SUSPENDU";
}>;

export type ExperienceDigitaleReq = Partial<{
  frequence_telephone: "FAIBLE" | "MOYENNE" | "ELEVEE";
  preference_notification: "FAIBLE" | "MOYENNE" | "ELEVEE";
  duree_attention_max: "COURTE" | "MOYENNE" | "LONGUE";
  contexte_utilisation: "CALME" | "DEPLACEMENT" | "BRUIT";
}>;

export type ExperienceSportiveReq = Partial<{
  historique_AP: "AUCUN" | "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE";
  niveau_ressenti: number; // 0..10
  rapport_douleur: "AUCUNE" | "OCCASIONNELLE" | "FREQUENTE";
  croyance_principale: string;
  commentaire_croyance: string;
}>;

export type ConsentReq = { type_consentement: "RGPD" | "DONNEES_SANTE" | "CGU"; version_document: string };

export type TestInput = {
  type_test: "MOBILITE" | "STABILITE" | "CONSCIENCE";
  zone_corps: string;
  amplitude: "FAIBLE" | "MOYENNE" | "BONNE";
  fluidite: "FAIBLE" | "MOYENNE" | "BONNE";
  sensation: "INCONFORT" | "NEUTRE" | "BONNE";
  asymetrie_flag: boolean;
  douleur_nrs: number; // 0..10
  duree_equilibre_sec?: number;
};

export type CreateBilanReq = { type_bilan: "AUTO_COMPLET"; date_bilan: string; tests: TestInput[] };

export type GenerateProgrammeReq = { bilan_id: string };

export type FeedbackReq = {
  rpe: number; // 0..10
  douleur_nrs_post: number; // 0..10
  ressenti_general: "TRES_FACILE" | "FACILE" | "BON" | "DIFFICILE" | "TRES_DIFFICILE";
  commentaire_libre?: string;
  date_execution?: string;
};

export type Api = {
  signup: (body: SignupReq) => Promise<ApiResponse<{ tokens: { accessToken: string; refreshToken: string }; utilisateur: any }>>;
  login: (body: LoginReq) => Promise<ApiResponse<AuthRes>>;
  logout: () => Promise<ApiResponse<{ ok: true }>>;
  me: () => Promise<ApiResponse<any>>;
  updateMe: (body: UpdateMeReq) => Promise<ApiResponse<any>>;
  upsertExperienceDigitale: (body: ExperienceDigitaleReq) => Promise<ApiResponse<any>>;
  upsertExperienceSportive: (body: ExperienceSportiveReq) => Promise<ApiResponse<any>>;
  addConsent: (body: ConsentReq) => Promise<ApiResponse<any>>;
  listConsents: () => Promise<ApiResponse<any[]>>;
  testsDefinition: () => Promise<ApiResponse<any>>;
  createBilan: (body: CreateBilanReq) => Promise<ApiResponse<any>>;
  generateProgramme: (body: GenerateProgrammeReq) => Promise<ApiResponse<{ programme: any; premiere_seance_id: string }>>;
  getProgramme: (id: string) => Promise<ApiResponse<any>>;
  getSeance: (id: string) => Promise<ApiResponse<any>>;
  addFeedback: (seanceId: string, body: FeedbackReq) => Promise<ApiResponse<any>>;
  dashboard: () => Promise<ApiResponse<any>>;
  notifications: () => Promise<ApiResponse<any[]>>;
  markNotification: (id: string, body: { lu: boolean }) => Promise<ApiResponse<any>>;
  alerts: () => Promise<ApiResponse<any[]>>;
};

export function makeGeneseApi(request: <T>(path: string, init?: RequestInit) => Promise<ApiResponse<T>>): Api {
  return {
    signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
    login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    logout: () => request("/auth/logout", { method: "POST" }),
    me: () => request("/users/me", { method: "GET" }),
    updateMe: (body) => request("/users/me", { method: "PUT", body: JSON.stringify(body) }),
    upsertExperienceDigitale: (body) => request("/users/me/experience-digitale", { method: "PUT", body: JSON.stringify(body) }),
    upsertExperienceSportive: (body) => request("/users/me/experience-sportive", { method: "PUT", body: JSON.stringify(body) }),
    addConsent: (body) => request("/users/me/consents", { method: "POST", body: JSON.stringify(body) }),
    listConsents: () => request("/users/me/consents", { method: "GET" }),
    testsDefinition: () => request("/bilans/tests-definition", { method: "GET" }),
    createBilan: (body) => request("/bilans", { method: "POST", body: JSON.stringify(body) }),
    generateProgramme: (body) => request("/programmes/generate", { method: "POST", body: JSON.stringify(body) }),
    getProgramme: (id) => request(`/programmes/${id}`, { method: "GET" }),
    getSeance: (id) => request(`/seances/${id}`, { method: "GET" }),
    addFeedback: (seanceId, body) => request(`/seances/${seanceId}/feedback`, { method: "POST", body: JSON.stringify(body) }),
    dashboard: () => request("/dashboard", { method: "GET" }),
    notifications: () => request("/notifications", { method: "GET" }),
    markNotification: (id, body) => request(`/notifications/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    alerts: () => request("/alerts", { method: "GET" })
  };
}

import mongoose, { Schema } from "mongoose";
import {
  Genre,
  Objectif,
  TempsDispo,
  LieuPratique,
  NiveauActivite,
  StatutCompte
} from "../constants/enums";
import { uuid } from "../utils/uuid";

export type UtilisateurDoc = {
  _id: string;
  email: string;
  mot_de_passe_hash: string;
  prenom?: string;
  age?: number;
  genre?: string;
  metier?: string;
  objectif_principal?: string;
  temps_disponible?: string;
  lieu_pratique?: string;
  niveau_activite?: string;
  date_creation: Date;
  statut_compte: string;

  // auth internals
  refresh_token_hash?: string | null;
};

const UtilisateurSchema = new Schema<UtilisateurDoc>(
  {
    _id: { type: String, default: uuid },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    mot_de_passe_hash: { type: String, required: true },

    prenom: { type: String },
    age: { type: Number, min: 10, max: 100 },
    genre: { type: String, enum: Object.values(Genre) },
    metier: { type: String },
    objectif_principal: { type: String, enum: Object.values(Objectif) },
    temps_disponible: { type: String, enum: Object.values(TempsDispo) },
    lieu_pratique: { type: String, enum: Object.values(LieuPratique) },
    niveau_activite: { type: String, enum: Object.values(NiveauActivite) },

    date_creation: { type: Date, default: () => new Date() },
    statut_compte: { type: String, enum: Object.values(StatutCompte), default: StatutCompte.EN_ATTENTE },

    refresh_token_hash: { type: String, default: null }
  },
  { timestamps: true }
);

export const Utilisateur = mongoose.model<UtilisateurDoc>("Utilisateur", UtilisateurSchema);
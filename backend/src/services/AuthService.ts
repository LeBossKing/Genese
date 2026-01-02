import { ApiError } from "../utils/apiError";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { SubjectType, Role } from "../constants/enums";
import { Utilisateur } from "../models/utilisateur.model";
import { Administrateur } from "../models/administrateur.model";

export class AuthService {
  static async signupUser(input: { email: string; mot_de_passe: string; prenom?: string }) {
    const email = input.email.toLowerCase().trim();
    const existing = await Utilisateur.findOne({ email });
    if (existing) throw ApiError.conflict("Email déjà utilisé");

    const mot_de_passe_hash = await hashPassword(input.mot_de_passe);
    const user = await Utilisateur.create({
      email,
      mot_de_passe_hash,
      prenom: input.prenom
    });

    const tokens = await this.issueTokens({ sub: user._id, subjectType: SubjectType.USER, role: Role.USER });
    await Utilisateur.updateOne({ _id: user._id }, { $set: { refresh_token_hash: await hashPassword(tokens.refreshToken) } });

    return { utilisateur_id: user._id, tokens };
  }

  static async login(input: { email: string; mot_de_passe: string }) {
    const email = input.email.toLowerCase().trim();

    // try user first
    const user = await Utilisateur.findOne({ email });
    if (user) {
      const ok = await verifyPassword(input.mot_de_passe, user.mot_de_passe_hash);
      if (!ok) throw ApiError.unauthorized("Identifiants invalides");

      const tokens = await this.issueTokens({ sub: user._id, subjectType: SubjectType.USER, role: Role.USER });
      await Utilisateur.updateOne({ _id: user._id }, { $set: { refresh_token_hash: await hashPassword(tokens.refreshToken) } });
      return tokens;
    }

    const admin = await Administrateur.findOne({ email });
    if (!admin) throw ApiError.unauthorized("Identifiants invalides");

    const ok = await verifyPassword(input.mot_de_passe, admin.mot_de_passe_hash);
    if (!ok) throw ApiError.unauthorized("Identifiants invalides");

    const tokens = await this.issueTokens({ sub: admin._id, subjectType: SubjectType.ADMIN, role: admin.role as any });
    await Administrateur.updateOne({ _id: admin._id }, { $set: { refresh_token_hash: await hashPassword(tokens.refreshToken) } });
    return tokens;
  }

  static async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    if (payload.subjectType === SubjectType.USER) {
      const user = await Utilisateur.findById(payload.sub);
      if (!user) throw ApiError.unauthorized();
      if (!user.refresh_token_hash) throw ApiError.unauthorized();

      const ok = await verifyPassword(refreshToken, user.refresh_token_hash);
      if (!ok) throw ApiError.unauthorized();

      const tokens = await this.issueTokens(payload);
      await Utilisateur.updateOne({ _id: user._id }, { $set: { refresh_token_hash: await hashPassword(tokens.refreshToken) } });
      return tokens;
    }

    const admin = await Administrateur.findById(payload.sub);
    if (!admin) throw ApiError.unauthorized();
    if (!admin.refresh_token_hash) throw ApiError.unauthorized();

    const ok = await verifyPassword(refreshToken, admin.refresh_token_hash);
    if (!ok) throw ApiError.unauthorized();

    const tokens = await this.issueTokens(payload);
    await Administrateur.updateOne({ _id: admin._id }, { $set: { refresh_token_hash: await hashPassword(tokens.refreshToken) } });
    return tokens;
  }

  static async logout(subject: { sub: string; subjectType: string }) {
    if (subject.subjectType === SubjectType.USER) {
      await Utilisateur.updateOne({ _id: subject.sub }, { $set: { refresh_token_hash: null } });
      return;
    }
    await Administrateur.updateOne({ _id: subject.sub }, { $set: { refresh_token_hash: null } });
  }

  private static async issueTokens(payload: { sub: string; subjectType: any; role: any }) {
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    return { accessToken, refreshToken, subjectType: payload.subjectType, role: payload.role };
  }
}
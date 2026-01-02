import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { SubjectType, Role } from "../constants/enums";

export type AccessPayload = {
  sub: string;
  subjectType: SubjectType;
  role: Role;
};

export function signAccessToken(payload: AccessPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL_SECONDS });
}

export function signRefreshToken(payload: AccessPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL_SECONDS });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload & { iat: number; exp: number };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AccessPayload & { iat: number; exp: number };
}
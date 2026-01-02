export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: ErrorCode;
  public readonly details?: unknown;

  constructor(status: number, code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, "BAD_REQUEST", message, details);
  }
  static unauthorized(message = "Non authentifié") {
    return new ApiError(401, "UNAUTHORIZED", message);
  }
  static forbidden(message = "Accès interdit") {
    return new ApiError(403, "FORBIDDEN", message);
  }
  static notFound(message = "Introuvable") {
    return new ApiError(404, "NOT_FOUND", message);
  }
  static conflict(message = "Conflit") {
    return new ApiError(409, "CONFLICT", message);
  }
  static internal(message = "Erreur interne", details?: unknown) {
    return new ApiError(500, "INTERNAL", message, details);
  }
}
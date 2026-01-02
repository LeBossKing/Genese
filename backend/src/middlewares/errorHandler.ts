import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const e = err instanceof ApiError ? err : ApiError.internal("Erreur interne", err);
  res.status(e.status).json({
    success: false,
    error: {
      code: e.code,
      message: e.message,
      details: e.details ?? null
    }
  });
}
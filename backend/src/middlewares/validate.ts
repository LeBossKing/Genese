import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ApiError } from "../utils/apiError";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    if (!parsed.success) {
      return next(ApiError.badRequest("Validation invalide", parsed.error.flatten()));
    }
    (req as any).validated = parsed.data;
    next();
  };
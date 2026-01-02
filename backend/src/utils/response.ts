import type { Response } from "express";

export function ok<T>(res: Response, data: T) {
  return res.json({ success: true, data });
}
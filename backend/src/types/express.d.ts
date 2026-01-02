import type { AccessPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      auth?: AccessPayload;
      validated?: any;
    }
  }
}

export {};
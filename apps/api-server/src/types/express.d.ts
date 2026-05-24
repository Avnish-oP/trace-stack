import type { AuthenticatedUser } from "@trace-stack/shared";

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
    }
  }
}

export {};

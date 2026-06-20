import jwt from "jsonwebtoken";
import { config } from "../config";

export interface TokenPayload {
  userId: string;
  email: string;
  name?: string | null;
}

/**
 * Verify a JWT token issued by the api-server.
 * Returns the decoded payload or throws on invalid/expired tokens.
 */
export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, config.API_JWT_SECRET) as any;

  const userId = decoded.userId ?? decoded.sub;

  if (!userId || !decoded.email) {
    throw new Error("Invalid token payload");
  }

  return {
    userId,
    email: decoded.email,
    name: decoded.name ?? null,
  };
}

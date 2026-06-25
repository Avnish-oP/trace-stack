import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedUser, JwtPayload } from "@trace-stack/shared";
import { config } from "../config";
import { errorResponse } from "../utils/apiResponse";

type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

/**
 * Authentication middleware.
 *
 * Verifies the JWT from the Authorization header and attaches the decoded
 * user payload to `req` for downstream handlers.
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    errorResponse(res, "Authentication required.", 401);
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, config.API_JWT_SECRET) as JwtPayload & {
      sub?: string;
      name?: string | null;
    };

    const userId = decoded.userId ?? decoded.sub;

    if (!userId || !decoded.email) {
      errorResponse(res, "Invalid authentication token.", 401);
      return;
    }

    (req as AuthenticatedRequest).user = {
      userId,
      email: decoded.email,
      name: decoded.name ?? null,
    };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    errorResponse(res, "Invalid or expired authentication token.", 401);
  }
}

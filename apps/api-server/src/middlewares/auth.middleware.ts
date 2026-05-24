import { Request, Response, NextFunction } from "express";

/**
 * Authentication middleware.
 *
 * Verifies the JWT from the Authorization header and attaches the decoded
 * user payload to `req` for downstream handlers.
 */
export function authenticate(
  _req: Request,
  _res: Response,
  next: NextFunction,
): void {
  // TODO: Extract Bearer token from Authorization header
  // TODO: Verify token with jsonwebtoken
  // TODO: Attach decoded payload to req (e.g. req.user)
  next();
}

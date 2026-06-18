import { Request, Response, NextFunction } from "express";
import { validateApiKey } from "../services/ingestion";
import { ERROR_MESSAGES } from "@trace-stack/shared";

// ─── Augment Express Request ─────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      /** Authenticated project ID (set by API key auth middleware) */
      projectId?: string;
      /** Authenticated API key ID (set by API key auth middleware) */
      apiKeyId?: string;
    }
  }
}

// ─── API Key Auth Middleware ─────────────────────────────────

/**
 * Middleware that validates the x-api-key header.
 *
 * Uses prefix-based O(1) lookup → bcrypt verify.
 * On success, attaches `req.projectId` and `req.apiKeyId`.
 */
export async function apiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const rawKey = req.headers["x-api-key"] as string | undefined;

  if (!rawKey) {
    res.status(401).json({
      success: false,
      error: ERROR_MESSAGES.API_KEY_REQUIRED,
    });
    return;
  }

  const result = await validateApiKey(rawKey);

  if (!result) {
    res.status(401).json({
      success: false,
      error: ERROR_MESSAGES.API_KEY_INVALID,
    });
    return;
  }

  // Attach to request for downstream handlers
  req.projectId = result.projectId;
  req.apiKeyId = result.apiKeyId;
  next();
}

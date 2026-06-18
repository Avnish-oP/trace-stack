import { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis";
import { config } from "../config";
import { ERROR_MESSAGES } from "@trace-stack/shared";

// ─── Rate Limit Middleware ───────────────────────────────────

/**
 * Redis-backed sliding window rate limiter for the ingestion API.
 *
 * Rate limits per API key (using req.apiKeyId set by auth middleware).
 * Falls back to IP-based limiting if apiKeyId is not available.
 *
 * Limits are configurable via env vars:
 * - RATE_LIMIT_MAX (default: 100)
 * - RATE_LIMIT_WINDOW_SECONDS (default: 60)
 */
export async function rateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Prefer API key ID for per-key limiting, fall back to IP
  const identity =
    req.apiKeyId ?? req.ip ?? req.socket.remoteAddress ?? "unknown";
  const key = `rate-limit:ingest:${identity}`;

  try {
    const count = await redis.incr(key);

    // Set TTL only on first increment (new window)
    if (count === 1) {
      await redis.expire(key, config.RATE_LIMIT_WINDOW_SECONDS);
    }

    // Add rate limit headers for transparency
    res.setHeader("X-RateLimit-Limit", config.RATE_LIMIT_MAX.toString());
    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(0, config.RATE_LIMIT_MAX - count).toString()
    );

    if (count > config.RATE_LIMIT_MAX) {
      const retryAfter = await redis.ttl(key);
      res.setHeader("Retry-After", Math.max(retryAfter, 1).toString());
      res.status(429).json({
        success: false,
        error: ERROR_MESSAGES.RATE_LIMITED,
      });
      return;
    }

    next();
  } catch (error) {
    // If Redis is down, allow the request through (fail open)
    // Log the error for monitoring
    console.error("[ingestion-api:rate-limit] Redis error:", error);
    next();
  }
}

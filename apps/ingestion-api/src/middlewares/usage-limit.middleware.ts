import { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis";
import { config } from "../config";

// ─── Usage Limit Middleware ────────────────────────────────────

/**
 * Redis-backed monthly usage tracker for the free tier.
 * Limits the total number of logs ingested per project per month.
 */
export async function usageLimit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const projectId = req.projectId;

  if (!projectId) {
    // Should be set by apiKeyAuth
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  try {
    const logsCount = Array.isArray(req.body?.logs) ? req.body.logs.length : 1;
    const date = new Date();
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const key = `usage:project:${projectId}:${yearMonth}`;

    const count = await redis.incrby(key, logsCount);

    // Set TTL for 40 days on first increment to ensure it cleans up naturally
    if (count === logsCount) {
      await redis.expire(key, 40 * 24 * 60 * 60);
    }

    if (count > config.FREE_TIER_MONTHLY_LIMIT) {
      // Revert the increment since we are rejecting the batch
      await redis.decrby(key, logsCount);
      
      res.status(429).json({
        success: false,
        error: "Monthly log limit exceeded. Upgrade your plan to ingest more logs.",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("[ingestion-api:usage-limit] Redis error:", error);
    // Fail open if Redis is down, we don't want to block ingestion for DB issues
    next();
  }
}

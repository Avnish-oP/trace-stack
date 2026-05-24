import { NextFunction, Request, Response } from "express";
import { redis } from "../lib/redis";
import { errorResponse } from "../utils/apiResponse";

interface RateLimitOptions {
  keyPrefix: string;
  limit: number;
  windowSeconds: number;
  getKey?: (req: Request) => string;
}

export function redisRateLimit(options: RateLimitOptions) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const identity =
      options.getKey?.(req) ?? req.ip ?? req.socket.remoteAddress ?? "unknown";
    const key = `rate-limit:${options.keyPrefix}:${identity}`;

    try {
      const count = await redis.incr(key);

      if (count === 1) {
        await redis.expire(key, options.windowSeconds);
      }

      if (count > options.limit) {
        const retryAfter = await redis.ttl(key);
        res.setHeader("Retry-After", Math.max(retryAfter, 1).toString());
        errorResponse(res, "Too many requests. Please try again later.", 429);
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

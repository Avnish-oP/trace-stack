import Redis from "ioredis";
import { config } from "../config";

// ─── Redis Singleton ─────────────────────────────────────────

const globalForRedis = globalThis as unknown as {
  ingestionRedis: Redis | undefined;
};

export const redis =
  globalForRedis.ingestionRedis ??
  new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: null,
    family: 0,
    keepAlive: 10000,
    enableReadyCheck: false,
  });

redis.on("error", (error) => {
  console.error("[ingestion-api:redis]", error.message);
});

if (config.NODE_ENV !== "production") {
  globalForRedis.ingestionRedis = redis;
}

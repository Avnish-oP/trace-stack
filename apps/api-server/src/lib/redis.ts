import Redis from "ioredis";
import { config } from "../config";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: 2,
    enableReadyCheck: false,
  });

redis.on("error", (error) => {
  console.error("[Redis]", error.message);
});

if (config.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

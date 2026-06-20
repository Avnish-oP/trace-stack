import Redis from "ioredis";
import { config } from "../config";

// ─── General-purpose Redis connection ────────────────────────
export const redis = new Redis(config.REDIS_URL);

// ─── Dedicated Pub/Sub subscriber ────────────────────────────
// Redis requires a separate connection for subscriptions.
// Once a connection calls `psubscribe`, it can only receive messages.
export const subscriber = new Redis(config.REDIS_URL);

redis.on("error", (err) => {
  console.error("[ws-server:redis] Connection error:", err.message);
});

subscriber.on("error", (err) => {
  console.error("[ws-server:subscriber] Connection error:", err.message);
});

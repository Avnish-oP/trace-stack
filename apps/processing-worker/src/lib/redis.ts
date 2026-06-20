import Redis from "ioredis";
import { config } from "../config";

export const redis = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
});

// Used for Redis Pub/Sub later
export const pubsub = new Redis(config.REDIS_URL);

import "dotenv/config";
import { Queue } from "bullmq";
import { redis } from "./lib/redis";
import "./worker";

console.log("[processing-worker] Starting log processing worker...");

// Setup the log-retention cron job
const queue = new Queue("log-ingestion", { connection: redis });
queue.add(
  "retention-cron",
  {},
  {
    repeat: {
      pattern: "0 * * * *", // Every hour
    },
  }
).then(() => {
  console.log("[processing-worker] Log retention cron job scheduled.");
}).catch((err) => {
  console.error("[processing-worker] Failed to schedule retention job:", err);
});

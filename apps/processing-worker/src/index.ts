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

// ─── Dummy HTTP Server for Render Free Tier ─────────────────────
// Render's free tier only supports Web Services, which require a port
// to be bound. This dummy server satisfies the port scan health check.
import http from "http";

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("ok");
  } else {
    res.writeHead(200);
    res.end("Processing worker is running.");
  }
});

server.listen(PORT, () => {
  console.log(`[processing-worker] Dummy HTTP server listening on port ${PORT} to satisfy Render.`);
});

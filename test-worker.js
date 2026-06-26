const { Worker } = require("bullmq");
const Redis = require("ioredis");

const redis = new Redis('rediss://default:ATmoAAIncDJiMjllYzVlNjVkMzA0NWRjOGUwMzg2NDU4OGRmMWU1OHAyMTQ3NjA@bold-skunk-14760.upstash.io:6379', { maxRetriesPerRequest: null });

const worker = new Worker("log-ingestion", async (job) => {
  console.log("Processed job:", job.name, job.data);
}, { connection: redis });

worker.on("ready", () => console.log("Worker ready"));
worker.on("error", (err) => console.log("Worker error:", err));

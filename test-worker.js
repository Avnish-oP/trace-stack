const { Worker } = require("bullmq");
const Redis = require("ioredis");

const redis = new Redis('', { maxRetriesPerRequest: null });

const worker = new Worker("log-ingestion", async (job) => {
  console.log("Processed job:", job.name, job.data);
}, { connection: redis });

worker.on("ready", () => console.log("Worker ready"));
worker.on("error", (err) => console.log("Worker error:", err));

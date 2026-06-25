import { Worker } from "bullmq";
import { redis } from "./lib/redis";
import { processLogBatch } from "./processors/log.processor";
import { runRetentionJob } from "./jobs/retention.job";

const QUEUE_NAME = "log-ingestion";

export const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "batch-ingest") {
      await processLogBatch(job);
    } else if (job.name === "retention-cron") {
      await runRetentionJob();
    }
  },
  {
    connection: redis,
  }
);

worker.on("completed", (job) => {
  // console.log(`Job ${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} has failed with ${err.message}`);
});

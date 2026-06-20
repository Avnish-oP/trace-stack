import { Job } from "bullmq";
import prisma from "@trace-stack/db";
import { pubsub } from "../lib/redis";
import type { Prisma } from "@trace-stack/db";

export async function processLogBatch(job: Job) {
  const { projectId, logs } = job.data;

  // 1. Batch insert to DB
  await prisma.log.createMany({
    data: logs.map((log: any) => ({
      message: log.message,
      level: log.level,
      timestamp: new Date(log.timestamp),
      projectId,
      serviceName: log.serviceName,
      source: log.source,
      metadata: log.metadata as Prisma.InputJsonValue,
    })),
  });

  // 2. Publish to Redis Pub/Sub for real-time streaming
  for (const log of logs) {
    const pubLog = {
      ...log,
      projectId,
      timestamp: new Date(log.timestamp).toISOString(),
    };
    pubsub.publish(`logs:${projectId}`, JSON.stringify(pubLog));
  }

  console.log(`[Worker] Processed batch of ${logs.length} logs for project ${projectId}`);
}

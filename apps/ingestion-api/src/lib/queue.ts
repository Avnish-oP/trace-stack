import { Queue } from "bullmq";
import { redis } from "./redis";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

export const QUEUE_NAME = "log-ingestion";

export const logIngestionQueue = new Queue(QUEUE_NAME, {
  connection: redis,
});

// Setup Bull Board
export const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(logIngestionQueue)],
  serverAdapter,
});

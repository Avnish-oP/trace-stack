import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import prisma from "../lib/prisma";
import { IngestLogsSchema } from "@trace-stack/shared";
import type { Prisma } from "@trace-stack/db";

// ─── Ingest Logs Controller ─────────────────────────────────

/**
 * Handles log ingestion requests.
 *
 * Auth is handled upstream by apiKeyAuth middleware,
 * which sets req.projectId and req.apiKeyId.
 *
 * Returns 202 Accepted (logs accepted for processing).
 */
export const ingestLogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.projectId!;
    const requestId = randomUUID();

    // 1. Payload schema validation (Zod)
    const parsed = IngestLogsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        requestId,
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    // 2. Save logs to DB in batch
    // TODO: Phase 3 — replace direct DB write with queue push
    await prisma.log.createMany({
      data: parsed.data.logs.map((log) => ({
        message: log.message,
        level: log.level,
        timestamp: new Date(log.timestamp),
        projectId,
        serviceName: log.serviceName,
        source: log.source,
        metadata: log.metadata as Prisma.InputJsonValue,
      })),
    });

    // 3. Respond with 202 Accepted + request ID for traceability
    res.setHeader("X-Request-Id", requestId);
    res.status(202).json({
      success: true,
      requestId,
      data: { ingested: parsed.data.logs.length },
    });
  } catch (error) {
    next(error);
  }
};
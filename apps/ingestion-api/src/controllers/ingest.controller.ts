import { Request, Response } from "express";
import { validateApiKey } from "../services/ingestion";
import prisma from "../lib/prisma";
import { IngestLogsSchema } from "@trace-stack/shared";
import type { Prisma } from "@trace-stack/db";

export const ingestLogsController = async (req: Request, res: Response) => {
  try {
    // 1. API key validation
    const apiKey = req.headers["x-api-key"] as string;
    if (!apiKey) {
      return res.status(401).json({ success: false, error: "API key is required" });
    }

    const projectId = await validateApiKey(apiKey);
    if (!projectId) {
      return res.status(401).json({ success: false, error: "Invalid API key" });
    }

    // 2. Payload schema validation (Zod)
    const parsed = IngestLogsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }

    // 3. Save logs to DB in batch
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

    res.status(200).json({
      success: true,
      data: { ingested: parsed.data.logs.length },
    });
  } catch (error) {
    console.error("Error ingesting logs:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
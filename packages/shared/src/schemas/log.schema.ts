import { z } from "zod";
import { LOG_LEVELS } from "../constants";

// ─── Single Log Entry (from SDK) ─────────────────────────────

export const LogEntrySchema = z.object({
  level: z.enum(LOG_LEVELS, {
    error: `Invalid log level. Must be one of: ${LOG_LEVELS.join(", ")}`,
  }),
  message: z
    .string()
    .min(1, "Log message is required")
    .max(10_000, "Log message must be under 10,000 characters"),
  timestamp: z
    .string()
    .datetime({ message: "Timestamp must be a valid ISO 8601 date string" }),
  serviceName: z
    .string()
    .min(1, "Service name is required")
    .max(255, "Service name must be under 255 characters"),
  source: z.string().max(255).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;

// ─── Batch Ingestion Payload ─────────────────────────────────

export const IngestLogsSchema = z.object({
  logs: z
    .array(LogEntrySchema)
    .min(1, "At least one log entry is required")
    .max(1000, "Maximum 1000 logs per batch"),
});

export type IngestLogsPayload = z.infer<typeof IngestLogsSchema>;

// ─── Log Query Params ────────────────────────────────────────

export const LogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  level: z.enum(LOG_LEVELS).optional(),
  serviceName: z.string().optional(),
  search: z.string().max(500).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z.enum(["timestamp", "createdAt", "level"]).default("timestamp"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type LogQuery = z.infer<typeof LogQuerySchema>;

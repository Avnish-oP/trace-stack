// ─── @trace-stack/node ───────────────────────────────────────
// Node.js SDK for TraceStack log ingestion.
//
// Usage:
//   import { TraceStack } from "@trace-stack/node";
//
//   const logger = new TraceStack({ apiKey: "ts_live_xxx" });
//   logger.info("Hello world");
// ──────────────────────────────────────────────────────────────

export { TraceStack } from "./client";

export type {
  TraceStackConfig,
  LogLevel,
  LogEntry,
  IngestPayload,
  IngestResponse,
  TransportResult,
} from "./types";

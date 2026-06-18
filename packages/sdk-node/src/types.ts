// ─── SDK Configuration ───────────────────────────────────────

/**
 * Configuration for the TraceStack SDK client.
 */
export interface TraceStackConfig {
  /**
   * Your TraceStack API key.
   * Must start with "ts_" (e.g., "ts_live_abc123...").
   */
  apiKey: string;

  /**
   * Service name attached to every log entry.
   * Identifies which service/app is sending logs.
   * @example "payment-service", "api-gateway"
   */
  serviceName?: string;

  /**
   * TraceStack ingestion API endpoint.
   * @default "http://localhost:5000"
   */
  endpoint?: string;

  /**
   * Number of logs to buffer before auto-flushing.
   * @default 50
   */
  batchSize?: number;

  /**
   * Interval (ms) between automatic flushes of the buffer.
   * @default 5000
   */
  flushInterval?: number;

  /**
   * Maximum number of retry attempts for failed HTTP requests.
   * Uses exponential backoff: 1s, 2s, 4s, ...
   * @default 3
   */
  maxRetries?: number;

  /**
   * HTTP request timeout in milliseconds.
   * @default 10000
   */
  timeout?: number;

  /**
   * Enable debug logging to console.
   * Useful during development to see SDK internals.
   * @default false
   */
  debug?: boolean;
}

// ─── Log Types ───────────────────────────────────────────────

/**
 * Supported log severity levels, ordered by severity.
 */
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

/**
 * A single log entry to be sent to TraceStack.
 */
export interface LogEntry {
  /** Log severity level */
  level: LogLevel;

  /** Human-readable log message */
  message: string;

  /** ISO 8601 timestamp */
  timestamp: string;

  /** Service name that generated the log */
  serviceName: string;

  /** Optional source identifier (file, module, function) */
  source?: string;

  /** Optional structured metadata */
  metadata?: Record<string, unknown>;
}

// ─── Transport Types ─────────────────────────────────────────

/**
 * Payload sent to the ingestion API.
 */
export interface IngestPayload {
  logs: LogEntry[];
}

/**
 * Response from the ingestion API.
 */
export interface IngestResponse {
  success: boolean;
  data?: {
    ingested: number;
  };
  error?: string;
}

/**
 * Result of a transport send operation.
 */
export interface TransportResult {
  success: boolean;
  statusCode?: number;
  ingested?: number;
  error?: string;
  retries: number;
}

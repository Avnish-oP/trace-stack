import type { TraceStackConfig, LogLevel, LogEntry } from "./types";
import { Transport } from "./transport";
import { Batcher } from "./batcher";
import os from "os";

// ─── Constants ───────────────────────────────────────────────

const API_KEY_PREFIX = "ts_";
const DEFAULT_ENDPOINT = "http://localhost:5000";

// ─── TraceStack Client ──────────────────────────────────────

/**
 * TraceStack SDK client for Node.js.
 *
 * Captures logs and sends them to the TraceStack ingestion API
 * with automatic batching, exponential backoff retry, and
 * graceful shutdown support.
 *
 * @example
 * ```ts
 * import { TraceStack } from "@trace-stack/node";
 *
 * const logger = new TraceStack({
 *   apiKey: "ts_live_xxxx",
 *   serviceName: "payment-service",
 * });
 *
 * logger.info("User logged in", { userId: "123" });
 * logger.error("Payment failed", { orderId: "456", amount: 999 });
 *
 * // On shutdown
 * await logger.destroy();
 * ```
 */
export class TraceStack {
  private readonly config: Required<
    Pick<TraceStackConfig, "serviceName" | "endpoint" | "debug">
  > &
    TraceStackConfig;
  private readonly batcher: Batcher;
  private readonly shutdownHandlers: (() => Promise<void>)[];
  private destroyed = false;

  // Auto-captured system metadata
  private readonly systemMeta: Record<string, unknown>;

  constructor(config: TraceStackConfig) {
    // ─── Validate API key ─────────────────────────────────
    if (!config.apiKey) {
      throw new Error("[TraceStack] apiKey is required");
    }
    if (!config.apiKey.startsWith(API_KEY_PREFIX)) {
      throw new Error(
        `[TraceStack] apiKey must start with "${API_KEY_PREFIX}" — got "${config.apiKey.substring(0, 10)}..."`
      );
    }

    // ─── Merge defaults ──────────────────────────────────
    this.config = {
      ...config,
      serviceName: config.serviceName ?? "default",
      endpoint: config.endpoint ?? DEFAULT_ENDPOINT,
      debug: config.debug ?? false,
    };

    // ─── System metadata (captured once) ─────────────────
    this.systemMeta = {
      hostname: os.hostname(),
      pid: process.pid,
      nodeVersion: process.version,
    };

    // ─── Initialize transport + batcher ──────────────────
    const transport = new Transport({
      endpoint: this.config.endpoint,
      apiKey: this.config.apiKey,
      maxRetries: config.maxRetries,
      timeout: config.timeout,
      debug: this.config.debug,
    });

    this.batcher = new Batcher({
      transport,
      batchSize: config.batchSize,
      flushInterval: config.flushInterval,
      debug: this.config.debug,
    });

    // ─── Graceful shutdown handlers ──────────────────────
    this.shutdownHandlers = [];
    this.registerShutdownHandlers();

    this.log("Initialized", {
      endpoint: this.config.endpoint,
      serviceName: this.config.serviceName,
      batchSize: config.batchSize ?? 50,
      flushInterval: config.flushInterval ?? 5000,
    });
  }

  // ─── Public Logging Methods ────────────────────────────

  /**
   * Log a debug-level message.
   */
  debug(message: string, metadata?: Record<string, unknown>): void {
    this.capture("debug", message, metadata);
  }

  /**
   * Log an info-level message.
   */
  info(message: string, metadata?: Record<string, unknown>): void {
    this.capture("info", message, metadata);
  }

  /**
   * Log a warning-level message.
   */
  warn(message: string, metadata?: Record<string, unknown>): void {
    this.capture("warn", message, metadata);
  }

  /**
   * Log an error-level message.
   */
  error(message: string, metadata?: Record<string, unknown>): void {
    this.capture("error", message, metadata);
  }

  /**
   * Log a fatal-level message.
   */
  fatal(message: string, metadata?: Record<string, unknown>): void {
    this.capture("fatal", message, metadata);
  }

  // ─── Buffer Control ────────────────────────────────────

  /**
   * Manually flush all buffered logs immediately.
   * Useful before a critical operation or checkpoint.
   */
  async flush(): Promise<void> {
    await this.batcher.flush();
  }

  /**
   * Gracefully shut down the SDK.
   * Flushes all remaining logs and stops background timers.
   * After calling destroy(), no new logs will be accepted.
   */
  async destroy(): Promise<void> {
    if (this.destroyed) return;
    this.destroyed = true;

    this.log("Shutting down...");
    this.removeShutdownHandlers();
    await this.batcher.destroy();
    this.log("Shutdown complete");
  }

  // ─── Internal ──────────────────────────────────────────

  /**
   * Capture a log entry and add it to the buffer.
   */
  private capture(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    if (this.destroyed) {
      this.log("SDK destroyed — dropping log");
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      serviceName: this.config.serviceName,
      metadata: metadata
        ? { ...this.systemMeta, ...metadata }
        : { ...this.systemMeta },
    };

    this.batcher.add(entry);
  }

  // ─── Shutdown Handlers ─────────────────────────────────

  private registerShutdownHandlers(): void {
    const handler = async () => {
      this.log("Received shutdown signal — flushing logs");
      await this.destroy();
    };

    // Wrap in a sync function for process event listeners
    const syncHandler = () => {
      handler().catch((err) => {
        console.error("[TraceStack] Error during shutdown flush:", err);
      });
    };

    process.on("SIGTERM", syncHandler);
    process.on("SIGINT", syncHandler);
    process.on("beforeExit", syncHandler);

    this.shutdownHandlers.push(async () => {
      process.removeListener("SIGTERM", syncHandler);
      process.removeListener("SIGINT", syncHandler);
      process.removeListener("beforeExit", syncHandler);
    });
  }

  private removeShutdownHandlers(): void {
    for (const remove of this.shutdownHandlers) {
      remove().catch(() => {});
    }
    this.shutdownHandlers.length = 0;
  }

  // ─── Debug Logging ─────────────────────────────────────

  private log(message: string, data?: Record<string, unknown>): void {
    if (this.config.debug) {
      const suffix = data ? ` ${JSON.stringify(data)}` : "";
      console.log(`[TraceStack] ${message}${suffix}`);
    }
  }
}

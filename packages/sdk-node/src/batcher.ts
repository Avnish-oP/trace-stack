import type { LogEntry } from "./types";
import { Transport } from "./transport";

// ─── Constants ───────────────────────────────────────────────

const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_FLUSH_INTERVAL = 5_000; // 5 seconds

// ─── Batcher ─────────────────────────────────────────────────

/**
 * In-memory log buffer that accumulates entries and
 * flushes them in batches via the Transport layer.
 *
 * Auto-flushes when:
 * - Buffer reaches `batchSize` threshold
 * - `flushInterval` timer fires
 *
 * Provides a mutex to prevent concurrent flushes.
 */
export class Batcher {
  private buffer: LogEntry[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private flushing = false;
  private destroyed = false;

  private readonly batchSize: number;
  private readonly flushInterval: number;
  private readonly transport: Transport;
  private readonly debug: boolean;

  constructor(options: {
    transport: Transport;
    batchSize?: number;
    flushInterval?: number;
    debug?: boolean;
  }) {
    this.transport = options.transport;
    this.batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
    this.flushInterval = options.flushInterval ?? DEFAULT_FLUSH_INTERVAL;
    this.debug = options.debug ?? false;

    // Start the periodic flush timer
    this.startTimer();
  }

  /**
   * Add a log entry to the buffer.
   * Triggers an immediate flush if the buffer reaches batchSize.
   */
  add(entry: LogEntry): void {
    if (this.destroyed) {
      this.log("SDK destroyed — dropping log entry");
      return;
    }

    this.buffer.push(entry);
    this.log(`Buffered log [${entry.level}]: ${entry.message.substring(0, 80)}`);

    // Auto-flush when batch size reached
    if (this.buffer.length >= this.batchSize) {
      this.log(`Batch size ${this.batchSize} reached — flushing`);
      // Fire-and-forget flush (don't block the caller)
      this.flush().catch((err) => {
        this.log(`Flush error: ${err}`);
      });
    }
  }

  /**
   * Flush all buffered logs to the transport.
   * Thread-safe: only one flush can run at a time.
   */
  async flush(): Promise<void> {
    // Mutex — prevent concurrent flushes
    if (this.flushing) {
      this.log("Flush already in progress — skipping");
      return;
    }

    if (this.buffer.length === 0) {
      return;
    }

    this.flushing = true;

    try {
      // Drain the buffer (take all current entries)
      const batch = this.buffer.splice(0, this.buffer.length);
      this.log(`Flushing ${batch.length} logs`);

      const result = await this.transport.send({ logs: batch });

      if (!result.success) {
        this.log(`Flush failed: ${result.error}`);
        // Note: we intentionally don't re-add failed logs to the buffer.
        // This prevents unbounded memory growth if the server is persistently down.
        // The transport layer already retried with backoff.
      }
    } finally {
      this.flushing = false;
    }
  }

  /**
   * Destroy the batcher: stop the timer and flush remaining logs.
   * After destroy(), no new logs can be added.
   */
  async destroy(): Promise<void> {
    if (this.destroyed) return;
    this.destroyed = true;

    this.stopTimer();
    this.log("Destroying batcher — final flush");
    await this.flush();
  }

  /**
   * Returns the current number of buffered logs.
   */
  get size(): number {
    return this.buffer.length;
  }

  // ─── Timer Management ──────────────────────────────────

  private startTimer(): void {
    if (this.flushInterval > 0) {
      this.flushTimer = setInterval(() => {
        this.flush().catch((err) => {
          this.log(`Periodic flush error: ${err}`);
        });
      }, this.flushInterval);

      // Allow the Node.js process to exit even if timer is running
      if (this.flushTimer && typeof this.flushTimer === "object" && "unref" in this.flushTimer) {
        this.flushTimer.unref();
      }
    }
  }

  private stopTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  // ─── Debug ─────────────────────────────────────────────

  private log(message: string): void {
    if (this.debug) {
      console.log(`[TraceStack:Batcher] ${message}`);
    }
  }
}

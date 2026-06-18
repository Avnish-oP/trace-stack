import type { IngestPayload, TransportResult } from "./types";

// ─── Constants ───────────────────────────────────────────────

const DEFAULT_TIMEOUT = 10_000; // 10 seconds
const DEFAULT_MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1_000; // 1 second

// ─── Transport ───────────────────────────────────────────────

/**
 * HTTP transport layer for the TraceStack SDK.
 * Handles sending log batches to the ingestion API with
 * exponential backoff retry on failures.
 */
export class Transport {
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly maxRetries: number;
  private readonly timeout: number;
  private readonly debug: boolean;

  constructor(options: {
    endpoint: string;
    apiKey: string;
    maxRetries?: number;
    timeout?: number;
    debug?: boolean;
  }) {
    this.endpoint = options.endpoint;
    this.apiKey = options.apiKey;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.debug = options.debug ?? false;
  }

  /**
   * Send a batch of logs to the ingestion API.
   * Retries with exponential backoff on transient failures.
   */
  async send(payload: IngestPayload): Promise<TransportResult> {
    const url = `${this.endpoint}/api/v1/logs/ingest`;
    let lastError: string | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        // Wait before retry (skip for first attempt)
        if (attempt > 0) {
          const delay = BASE_RETRY_DELAY * Math.pow(2, attempt - 1);
          this.log(`Retry attempt ${attempt}/${this.maxRetries} after ${delay}ms`);
          await this.sleep(delay);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Parse response body
        const body = await response.json().catch(() => ({})) as Record<string, unknown>;

        // Success
        if (response.ok) {
          const data = body.data as Record<string, unknown> | undefined;
          this.log(`Successfully sent ${payload.logs.length} logs`);
          return {
            success: true,
            statusCode: response.status,
            ingested: (data?.ingested as number) ?? payload.logs.length,
            retries: attempt,
          };
        }

        // Rate limited — retry with Retry-After if available
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          if (retryAfter && attempt < this.maxRetries) {
            const waitMs = parseInt(retryAfter, 10) * 1000;
            if (!isNaN(waitMs) && waitMs > 0) {
              this.log(`Rate limited. Waiting ${waitMs}ms (Retry-After header)`);
              await this.sleep(waitMs);
              continue;
            }
          }
          lastError = `Rate limited (429)`;
          continue;
        }

        // Client errors (4xx except 429) — don't retry
        if (response.status >= 400 && response.status < 500) {
          const errorMsg = (body.error as string) ?? `HTTP ${response.status}`;
          this.log(`Client error: ${errorMsg} — not retrying`);
          return {
            success: false,
            statusCode: response.status,
            error: errorMsg,
            retries: attempt,
          };
        }

        // Server errors (5xx) — retry
        lastError = `Server error: HTTP ${response.status}`;
        this.log(lastError);
      } catch (err: unknown) {
        // Network error or timeout — retry
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            lastError = `Request timeout after ${this.timeout}ms`;
          } else {
            lastError = `Network error: ${err.message}`;
          }
        } else {
          lastError = "Unknown transport error";
        }
        this.log(lastError);
      }
    }

    // All retries exhausted
    this.log(`All ${this.maxRetries} retries exhausted. Dropping ${payload.logs.length} logs.`);
    return {
      success: false,
      error: lastError ?? "Max retries exhausted",
      retries: this.maxRetries,
    };
  }

  // ─── Helpers ─────────────────────────────────────────────

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private log(message: string): void {
    if (this.debug) {
      console.log(`[TraceStack] ${message}`);
    }
  }
}

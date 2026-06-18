# @trace-stack/node

Official Node.js SDK for [TraceStack](https://tracestack.dev) — a multi-tenant observability and log monitoring platform.

**Zero dependencies** · Batching · Exponential backoff retry · Graceful shutdown · TypeScript-first

---

## Installation

```bash
npm install @trace-stack/node
```

> **Requires Node.js 18+** (uses native `fetch` API)

## Quick Start

```ts
import { TraceStack } from "@trace-stack/node";

const logger = new TraceStack({
  apiKey: "ts_live_xxxx",
  serviceName: "payment-service",
});

// Log at different severity levels
logger.debug("Debugging payment flow", { step: "init" });
logger.info("User logged in", { userId: "u_123" });
logger.warn("High memory usage", { memoryMB: 450 });
logger.error("Payment failed", { orderId: "ord_456", amount: 999 });
logger.fatal("Database connection lost", { host: "db-primary" });

// Graceful shutdown (flushes remaining logs)
process.on("SIGTERM", async () => {
  await logger.destroy();
  process.exit(0);
});
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | **required** | Your TraceStack API key (must start with `ts_`) |
| `serviceName` | `string` | `"default"` | Identifies the sending service |
| `endpoint` | `string` | `"http://localhost:5000"` | Ingestion API URL |
| `batchSize` | `number` | `50` | Logs to buffer before auto-flush |
| `flushInterval` | `number` | `5000` | Auto-flush interval in ms |
| `maxRetries` | `number` | `3` | Max retry attempts on failure |
| `timeout` | `number` | `10000` | HTTP request timeout in ms |
| `debug` | `boolean` | `false` | Log SDK internals to console |

## Features

### Batching

Logs are buffered in memory and flushed in batches for efficiency. Flushes happen when:
- The buffer reaches `batchSize` (default: 50 logs)
- The `flushInterval` timer fires (default: every 5 seconds)
- You call `logger.flush()` manually

```ts
// Manual flush before a critical operation
await logger.flush();
```

### Retry with Exponential Backoff

Failed HTTP requests are retried up to `maxRetries` times with exponential backoff:
- Attempt 1: immediate
- Retry 1: wait 1s
- Retry 2: wait 2s
- Retry 3: wait 4s

Rate-limited requests (HTTP 429) respect the `Retry-After` header. Client errors (4xx) are **not** retried.

### Auto-Metadata

Every log entry automatically includes:
- `hostname` — machine hostname
- `pid` — Node.js process ID
- `nodeVersion` — Node.js runtime version

Custom metadata is merged with system metadata:

```ts
logger.info("Order placed", { orderId: "123", amount: 49.99 });
// metadata = { hostname: "...", pid: 1234, nodeVersion: "v20.0.0", orderId: "123", amount: 49.99 }
```

### Graceful Shutdown

The SDK registers `SIGTERM`, `SIGINT`, and `beforeExit` handlers to flush remaining logs before the process exits.

You can also manually trigger shutdown:

```ts
await logger.destroy();
```

After `destroy()`, no new logs are accepted.

## API Reference

### `new TraceStack(config: TraceStackConfig)`

Creates a new TraceStack logger instance.

### `logger.debug(message, metadata?)`
### `logger.info(message, metadata?)`
### `logger.warn(message, metadata?)`
### `logger.error(message, metadata?)`
### `logger.fatal(message, metadata?)`

Log a message at the specified severity level.

- `message: string` — Log message (required)
- `metadata?: Record<string, unknown>` — Optional structured data

### `logger.flush(): Promise<void>`

Manually flush all buffered logs to the ingestion API.

### `logger.destroy(): Promise<void>`

Gracefully shut down the SDK. Flushes remaining logs and stops all timers.

## Log Levels

| Level | When to use |
|-------|-------------|
| `debug` | Detailed diagnostic information |
| `info` | General operational events |
| `warn` | Potential issues that aren't errors |
| `error` | Error events that might still allow the app to continue |
| `fatal` | Critical errors that require immediate attention |

## License

MIT

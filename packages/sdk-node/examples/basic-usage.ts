import { TraceStack } from "../src";

// Note: Replace this with a valid API key from your TraceStack dashboard
const API_KEY = process.env.TRACE_API_KEY || "ts_live_REPLACEME";

async function main() {
  console.log("🚀 Initializing TraceStack SDK...");

  const logger = new TraceStack({
    apiKey: API_KEY,
    serviceName: "example-app",
    endpoint: "http://localhost:5000",
    debug: true, // Enable debug to see internal SDK logs
    batchSize: 10, // Small batch size for demonstration
    flushInterval: 3000, // Flush every 3 seconds
  });

  console.log("\n📝 Sending individual logs at different levels...");
  
  logger.debug("Debugging application state", { state: "initialized" });
  logger.info("User logged in", { userId: "user_123" });
  logger.warn("High memory usage detected", { memoryMB: 850 });
  logger.error("Failed to process payment", { orderId: "ord_999", amount: 49.99 });
  logger.fatal("Database connection lost! Retrying...", { host: "db-main" });

  console.log("\n📦 Demonstrating batch auto-flush...");
  console.log("Sending 15 logs rapidly (batchSize is 10, so it will trigger an auto-flush)...");
  
  for (let i = 1; i <= 15; i++) {
    logger.info(`Batch log entry ${i}`, { iteration: i });
  }

  console.log("\n⏳ Waiting 4 seconds to let the interval timer flush the remaining 5 logs...");
  await new Promise((resolve) => setTimeout(resolve, 4000));

  console.log("\n🛑 Shutting down gracefully...");
  await logger.destroy();
  console.log("✅ Done!");
}

main().catch(console.error);

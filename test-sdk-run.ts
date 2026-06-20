import { TraceStack } from "./packages/sdk-node/src";

// Set up the SDK using the new generated valid API Key
const API_KEY = "ts_live_6fb928a0c95864d48a865170667c16afe71a4fcb83ef7a66624bd4931a15540b";

async function main() {
  console.log("🚀 Initializing TraceStack SDK with provided API key...");

  const logger = new TraceStack({
    apiKey: API_KEY,
    serviceName: "user-test-script",
    endpoint: "http://localhost:3002", 
    debug: true,
    batchSize: 2,
    flushInterval: 2000,
  });

  console.log("📝 Sending test logs...");
  
  logger.info("Hello from the test script!");
  logger.warn("This is a simulated warning event", { user: "avnish", action: "test" });
  logger.error("Simulated error occurred in the payment gateway", { amount: 150.00, currency: "USD" });

  console.log("⏳ Flushing remaining logs and shutting down...");
  await logger.destroy();
  console.log("✅ SDK test complete!");
}

main().catch(console.error);

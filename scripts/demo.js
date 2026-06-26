import { TraceStack } from "@trace-stack/node";


// Configuration - Update these before running!
const API_KEY = process.env.API_KEY || "ts_live_1e14b1884ec788f0ce5e455362cf3c4e9616e5360e347c93f152734b5e51a41a";
const ENDPOINT = process.env.ENDPOINT || "https://trace-stack.onrender.com";
console.log(API_KEY);
if (API_KEY !== "ts_live_1e14b1884ec788f0ce5e455362cf3c4e9616e5360e347c93f152734b5e51a41a") {
  console.error("❌ Please provide your API_KEY by editing the script or passing it as an environment variable.");
  process.exit(1);
}

// Initialize the TraceStack SDK
const logger = new TraceStack({
  apiKey: API_KEY,  
  endpoint: ENDPOINT,
  serviceName: "e-commerce-backend",
  batchSize: 10,
  flushInterval: 2000,
  debug: true, // Added debug mode
});

console.log("🚀 Starting TraceStack Demo Simulation...");
console.log(`📡 Sending logs to: ${ENDPOINT}`);

// Real-world scenarios to simulate
const scenarios = [
  () => logger.info("User login successful", { userId: "user_" + Math.floor(Math.random() * 10000), authMethod: "OAuth" }),
  () => logger.debug("Fetching user cart from cache", { cartId: "cart_" + Math.floor(Math.random() * 500) }),
  () => logger.info("Checkout process initiated", { amount: (Math.random() * 200).toFixed(2), currency: "USD" }),
  () => logger.warn("High memory usage detected", { memoryUsage: "85%", threshold: "80%" }),
  () => logger.debug("Database query executed", { queryTimeMs: Math.floor(Math.random() * 50) + 10, table: "orders" }),
  () => logger.error("Payment gateway timeout", { gateway: "Stripe", attempt: 1, errorCode: "TIMEOUT_5004" }),
  () => logger.info("Payment processed successfully", { transactionId: "txn_" + Date.now() }),
  () => logger.warn("Rate limit approaching for IP", { ip: "192.168.1." + Math.floor(Math.random() * 255), currentRequests: 95, limit: 100 }),
  () => logger.fatal("Database connection lost", { host: "db-main.internal", uptime: process.uptime() }),
  () => logger.info("Email receipt sent", { templateId: "receipt_v2" }),
];

let logsSent = 0;

console.log("Press Ctrl+C to stop the stream when you are done recording.\n");

// Function to send a log with a random delay to simulate organic traffic
function sendNextLog() {
  // Pick a random scenario
  const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  randomScenario();
  
  logsSent++;
  process.stdout.write(`\rSent ${logsSent} logs... (Streaming continuously)`);

  // Random delay between 100ms and 800ms to make it look organic
  const nextDelay = Math.floor(Math.random() * 700) + 100;
  setTimeout(sendNextLog, nextDelay);
}

// Start the continuous stream
sendNextLog();

// Handle graceful shutdown on Ctrl+C
process.on("SIGINT", async () => {
  console.log(`\n\n✅ Finished streaming. Sent a total of ${logsSent} logs.`);
  console.log("Waiting for final batch to flush...");
  await logger.shutdown();
  console.log("👋 Demo script complete!");
  process.exit(0);
});

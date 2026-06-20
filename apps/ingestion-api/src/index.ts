import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config";
import logsRoutes from "./routes/logs";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { serverAdapter } from "./lib/queue";
// ─── Express App ─────────────────────────────────────────────

const app = express();

// ─── Global Middleware ───────────────────────────────────────

app.use(
  cors({
    origin: config.CORS_ORIGIN === "*" ? "*" : config.CORS_ORIGIN,
    credentials: config.CORS_ORIGIN !== "*",
  })
);
app.use(helmet());
app.use(morgan(config.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));

// ─── Routes ──────────────────────────────────────────────────

app.use("/api/v1/logs", logsRoutes);

app.get("/health", (_, res) => {
  res.json({
    success: true,
    data: {
      service: "ingestion-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/admin/queues", serverAdapter.getRouter());

// ─── Error Handler (must be last) ────────────────────────────

app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────

app.listen(config.PORT, () => {
  console.log(`[ingestion-api] running on port ${config.PORT}`);
  console.log(`[ingestion-api] environment: ${config.NODE_ENV}`);
  console.log(
    `[ingestion-api] rate limit: ${config.RATE_LIMIT_MAX} req / ${config.RATE_LIMIT_WINDOW_SECONDS}s`
  );
});
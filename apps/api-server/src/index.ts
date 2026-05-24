import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { router as apiRouter } from "./routes";
import { errorHandler } from "./middlewares/error-handler.middleware";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
app.use("/api/v1", apiRouter);

// ---------------------------------------------------------------------------
// Global error handler (must be registered last)
// ---------------------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 api-server listening on http://localhost:${PORT}`);
});

export default app;

import { Router } from "express";
import { ingestLogsController } from "../controllers/ingest.controller";
import { apiKeyAuth } from "../middlewares/api-key-auth.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";

// ─── Ingestion Routes ────────────────────────────────────────

const router = Router();

// POST /api/v1/logs/ingest — Primary ingestion endpoint
// Pipeline: apiKeyAuth → rateLimit → ingestLogsController
router.post("/ingest", apiKeyAuth, rateLimit, ingestLogsController);

// POST /api/v1/logs/batch — Alias for batch ingestion (same handler)
router.post("/batch", apiKeyAuth, rateLimit, ingestLogsController);

export default router;
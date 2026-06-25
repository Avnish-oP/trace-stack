import { Router } from "express";
import { ingestLogsController } from "../controllers/ingest.controller";
import { apiKeyAuth } from "../middlewares/api-key-auth.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";
import { usageLimit } from "../middlewares/usage-limit.middleware";

// ─── Ingestion Routes ────────────────────────────────────────

const router = Router();

// POST /api/v1/logs/ingest — Primary ingestion endpoint
// Pipeline: apiKeyAuth → rateLimit → usageLimit → ingestLogsController
router.post("/ingest", apiKeyAuth, rateLimit, usageLimit, ingestLogsController);

// POST /api/v1/logs/batch — Alias for batch ingestion (same handler)
router.post("/batch", apiKeyAuth, rateLimit, usageLimit, ingestLogsController);

export default router;
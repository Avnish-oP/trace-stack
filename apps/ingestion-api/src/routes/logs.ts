import { Router } from "express";
import { ingestLogsController } from "../controllers/ingest.controller";

const router = Router();

router.post("/ingest", ingestLogsController);

export default router;
import { Router } from "express";
import * as logController from "../controllers/log.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { LogQuerySchema } from "@trace-stack/shared";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/projects/:projectId/logs", validate(LogQuerySchema, "query"), logController.getLogs);
export default router;

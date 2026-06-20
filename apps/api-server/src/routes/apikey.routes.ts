import { Router } from "express";
import * as apikeyController from "../controllers/apikey.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CreateApiKeySchema } from "@trace-stack/shared";

const router = Router({ mergeParams: true });

// This router is mounted at the root (`/`) of the API so its fully-qualified
// paths resolve correctly (e.g. `/api/v1/projects/:projectId/api-keys`).
// Because it is mounted at `/`, `authenticate` is applied per-route rather than
// router-wide to avoid leaking auth middleware onto other routers (e.g. /logs).

router.get(
  "/projects/:projectId/api-keys",
  authenticate,
  apikeyController.getApiKeys,
);
router.post(
  "/projects/:projectId/api-keys",
  authenticate,
  validate(CreateApiKeySchema),
  apikeyController.createApiKey,
);

router.delete("/api-keys/:keyId", authenticate, apikeyController.deleteApiKey);

export default router;

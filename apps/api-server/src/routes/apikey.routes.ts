import { Router } from "express";
import * as apikeyController from "../controllers/apikey.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CreateApiKeySchema } from "@trace-stack/shared";

const router = Router({ mergeParams: true });

router.use(authenticate);

// If mounted at `/projects`, we can do `/projects/:projectId/api-keys`
// Or if mounted at `/api-keys` directly. Let's provide explicit routes
// assuming it will be mounted at `/` or `/api-keys`.
// I'll make the routes clear here:

router.get("/projects/:projectId/api-keys", apikeyController.getApiKeys);
router.post("/projects/:projectId/api-keys", validate(CreateApiKeySchema), apikeyController.createApiKey);

router.delete("/api-keys/:keyId", apikeyController.deleteApiKey);

export default router;

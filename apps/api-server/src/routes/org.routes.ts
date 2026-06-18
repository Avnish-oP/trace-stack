import { Router } from "express";
import * as orgController from "../controllers/org.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CreateOrgSchema, UpdateOrgSchema } from "@trace-stack/shared";

const router = Router();

router.use(authenticate);

router.get("/", orgController.getOrgs);
router.post("/", validate(CreateOrgSchema), orgController.createOrg);
router.get("/:orgId", orgController.getOrgById);
router.patch("/:orgId", validate(UpdateOrgSchema), orgController.updateOrg);
router.delete("/:orgId", orgController.deleteOrg);

export default router;

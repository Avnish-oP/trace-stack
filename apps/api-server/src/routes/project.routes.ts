import { Router } from "express";
import * as projectController from "../controllers/project.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CreateProjectSchema, UpdateProjectSchema } from "@trace-stack/shared";

// `mergeParams: true` is important if this router is mounted as `/orgs/:orgId/projects` in the parent router.
const router = Router({ mergeParams: true });

router.use(authenticate);

// Note: If mounted at /orgs/:orgId/projects, these work well.
// But some of these only need projectId, so we'll just expose them here.
// In `index.ts`, it might be mounted at `/projects`, so we'll need to define `/orgs/:orgId/projects` separately.
// For now, we'll assume it's mounted at `/projects` and we use explicit paths for org-specific endpoints.

router.get("/orgs/:orgId", projectController.getProjects);
router.post("/orgs/:orgId", validate(CreateProjectSchema), projectController.createProject);

router.get("/:projectId", projectController.getProjectById);
router.patch("/:projectId", validate(UpdateProjectSchema), projectController.updateProject);
router.delete("/:projectId", projectController.deleteProject);

export default router;

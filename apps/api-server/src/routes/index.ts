import { Router } from "express";
import authRouter from "./auth.routes";
import orgRouter from "./org.routes";
import projectRouter from "./project.routes";
import apikeyRouter from "./apikey.routes";
import logRouter from "./log.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/orgs", orgRouter);
router.use("/projects", projectRouter);
// apikeyRouter defines fully-qualified paths internally
// (e.g. /projects/:projectId/api-keys and /api-keys/:keyId), so it is mounted
// at the root to avoid a doubled `/api-keys` prefix.
router.use("/", apikeyRouter);
router.use("/logs", logRouter);

export { router };

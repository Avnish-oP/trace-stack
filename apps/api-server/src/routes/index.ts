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
router.use("/api-keys", apikeyRouter);
router.use("/logs", logRouter);

export { router };

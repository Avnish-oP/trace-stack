import { Request, Response, NextFunction } from "express";
import * as logService from "../services/log.service";
import { successResponse } from "../utils/apiResponse";

type AuthRequest = Request & { user?: { userId: string } };

export const getLogs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const projectId = req.params.projectId as string;
    // The query is already validated by the middleware
    const result = await logService.getLogsForProject(userId, projectId, req.query as any);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

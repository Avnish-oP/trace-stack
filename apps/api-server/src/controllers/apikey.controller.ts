import { Request, Response, NextFunction } from "express";
import * as apikeyService from "../services/apikey.service";
import { successResponse } from "../utils/apiResponse";

type AuthRequest = Request & { user?: { userId: string } };

export const createApiKey = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const projectId = req.params.projectId as string;
    const apiKey = await apikeyService.createApiKey(userId, projectId, req.body);
    successResponse(res, apiKey, 201);
  } catch (error) {
    next(error);
  }
};

export const getApiKeys = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const projectId = req.params.projectId as string;
    const apiKeys = await apikeyService.getApiKeysForProject(userId, projectId);
    successResponse(res, apiKeys);
  } catch (error) {
    next(error);
  }
};

export const deleteApiKey = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const keyId = req.params.keyId as string;
    await apikeyService.revokeApiKey(userId, keyId);
    successResponse(res, null);
  } catch (error) {
    next(error);
  }
};

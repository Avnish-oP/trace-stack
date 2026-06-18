import { NextFunction, Request, Response } from "express";
import type { AuthenticatedUser } from "@trace-stack/shared";
import { successResponse } from "../utils/apiResponse";
import * as authService from "../services/auth.service";

type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.register(req.body);
    successResponse(res, result, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.login(req.body);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
}

export async function me(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authService.getCurrentUser(
      (req as AuthenticatedRequest).user.userId,
    );
    successResponse(res, { user });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authService.verifyEmail(req.query as { token: string });
    successResponse(res, { user });
  } catch (error) {
    next(error);
  }
}

export async function resendVerification(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.resendVerification(req.body);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
}

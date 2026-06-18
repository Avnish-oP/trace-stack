import { Request, Response, NextFunction } from "express";
import * as orgService from "../services/org.service";
import { successResponse } from "../utils/apiResponse";

type AuthRequest = Request & { user?: { userId: string } };

export const createOrg = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const org = await orgService.createOrganization(userId, req.body);
    successResponse(res, org, 201);
  } catch (error) {
    next(error);
  }
};

export const getOrgs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const orgs = await orgService.getOrganizationsForUser(userId);
    successResponse(res, orgs);
  } catch (error) {
    next(error);
  }
};

export const getOrgById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const orgId = req.params.orgId as string;
    const org = await orgService.getOrganizationById(userId, orgId);
    successResponse(res, org);
  } catch (error) {
    next(error);
  }
};

export const updateOrg = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const orgId = req.params.orgId as string;
    const org = await orgService.updateOrganization(userId, orgId, req.body);
    successResponse(res, org);
  } catch (error) {
    next(error);
  }
};

export const deleteOrg = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const orgId = req.params.orgId as string;
    await orgService.deleteOrganization(userId, orgId);
    successResponse(res, null);
  } catch (error) {
    next(error);
  }
};

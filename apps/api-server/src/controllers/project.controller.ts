import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/project.service";
import { successResponse } from "../utils/apiResponse";

type AuthRequest = Request & { user?: { userId: string } };

export const createProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    // The orgId can be passed in body or params. Let's assume body for now or query.
    // Based on the REST standard, usually it's POST /orgs/:orgId/projects
    const orgId = (req.params.orgId as string) || (req.body.organizationId as string);
    const project = await projectService.createProject(userId, orgId, req.body);
    successResponse(res, project, 201);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const orgId = req.params.orgId as string;
    const projects = await projectService.getProjectsForOrg(userId, orgId);
    successResponse(res, projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const projectId = req.params.projectId as string;
    const project = await projectService.getProjectById(userId, projectId);
    successResponse(res, project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const projectId = req.params.projectId as string;
    const project = await projectService.updateProject(userId, projectId, req.body);
    successResponse(res, project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const projectId = req.params.projectId as string;
    await projectService.deleteProject(userId, projectId);
    successResponse(res, null);
  } catch (error) {
    next(error);
  }
};

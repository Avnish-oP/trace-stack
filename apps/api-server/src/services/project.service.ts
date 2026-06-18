import { prisma } from "@trace-stack/db";
import { CreateProjectInput, UpdateProjectInput } from "@trace-stack/shared";
import { AppError } from "../utils/errors";
import { getOrganizationById } from "./org.service";

export async function createProject(
  userId: string,
  orgId: string,
  data: CreateProjectInput,
) {
  // Verify org exists and user has access
  await getOrganizationById(userId, orgId);

  return prisma.project.create({
    data: {
      name: data.name,
      environment: data.environment,
      organizationId: orgId,
    },
  });
}

export async function getProjectsForOrg(userId: string, orgId: string) {
  // Verify org exists and user has access
  await getOrganizationById(userId, orgId);

  return prisma.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectById(userId: string, projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { organization: true },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  // Ensure the user owns the organization this project belongs to
  if (project.organization.ownerId !== userId) {
    throw new AppError("Forbidden: You do not have access to this project", 403);
  }

  return project;
}

export async function updateProject(
  userId: string,
  projectId: string,
  data: UpdateProjectInput,
) {
  const project = await getProjectById(userId, projectId);

  return prisma.project.update({
    where: { id: project.id },
    data,
  });
}

export async function deleteProject(userId: string, projectId: string) {
  const project = await getProjectById(userId, projectId);

  await prisma.project.delete({
    where: { id: project.id },
  });

  return { success: true };
}

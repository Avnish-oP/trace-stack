import { prisma } from "@trace-stack/db";
import { CreateOrgInput, UpdateOrgInput } from "@trace-stack/shared";
import { AppError } from "../utils/errors";

export async function createOrganization(userId: string, data: CreateOrgInput) {
  return prisma.organization.create({
    data: {
      name: data.name,
      ownerId: userId,
    },
  });
}

export async function getOrganizationsForUser(userId: string) {
  return prisma.organization.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrganizationById(userId: string, orgId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!org) {
    throw new AppError("Organization not found", 404);
  }

  if (org.ownerId !== userId) {
    throw new AppError("Forbidden: You do not have access to this organization", 403);
  }

  return org;
}

export async function updateOrganization(
  userId: string,
  orgId: string,
  data: UpdateOrgInput,
) {
  const org = await getOrganizationById(userId, orgId);

  return prisma.organization.update({
    where: { id: org.id },
    data,
  });
}

export async function deleteOrganization(userId: string, orgId: string) {
  const org = await getOrganizationById(userId, orgId);

  await prisma.organization.delete({
    where: { id: org.id },
  });

  return { success: true };
}

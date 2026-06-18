import { prisma } from "@trace-stack/db";
import { CreateApiKeyInput } from "@trace-stack/shared";
import { AppError } from "../utils/errors";
import { getProjectById } from "./project.service";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function createApiKey(
  userId: string,
  projectId: string,
  data: CreateApiKeyInput,
) {
  // Ensure the user owns the project
  await getProjectById(userId, projectId);

  // Generate a random key
  const rawKey = crypto.randomBytes(32).toString("hex");
  const fullKey = `ts_live_${rawKey}`;

  // Prefix is max 12 chars according to schema (@db.VarChar(12))
  const prefix = fullKey.substring(0, 12);
  
  // Hash the full key
  const salt = await bcrypt.genSalt(10);
  const keyHash = await bcrypt.hash(fullKey, salt);

  const apiKey = await prisma.apiKey.create({
    data: {
      name: data.name,
      prefix,
      keyHash,
      projectId,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });

  return {
    ...apiKey,
    key: fullKey, // Return the raw key ONLY ONCE
  };
}

export async function getApiKeysForProject(userId: string, projectId: string) {
  // Ensure the user owns the project
  await getProjectById(userId, projectId);

  return prisma.apiKey.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      prefix: true,
      isActive: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
      projectId: true,
      // exclude keyHash
    },
  });
}

export async function revokeApiKey(userId: string, keyId: string) {
  const apiKey = await prisma.apiKey.findUnique({
    where: { id: keyId },
    include: { project: { include: { organization: true } } },
  });

  if (!apiKey) {
    throw new AppError("API Key not found", 404);
  }

  if (apiKey.project.organization.ownerId !== userId) {
    throw new AppError("Forbidden: You do not have access to this API Key", 403);
  }

  await prisma.apiKey.delete({
    where: { id: keyId },
  });

  return { success: true };
}

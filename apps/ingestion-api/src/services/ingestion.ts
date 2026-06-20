import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { API_KEY_IDENTIFIER } from "@trace-stack/shared";

/**
 * Validates an API key using prefix-based O(1) lookup.
 *
 * Strategy:
 * 1. Extract the prefix (first 8 chars after the "ts_" identifier) from the raw key
 * 2. Query DB for a single matching prefix (indexed column)
 * 3. bcrypt-verify only that one candidate
 *
 * This replaces the old O(n) approach that fetched ALL keys and compared each.
 *
 * @returns { projectId, apiKeyId } if valid, null otherwise
 */
export async function validateApiKey(
  rawKey: string
): Promise<{ projectId: string; apiKeyId: string } | null> {
  // Extract the prefix used for DB lookup (matches api-server logic of taking first 12 chars)
  const prefix = rawKey.substring(0, 12);

  const apiKey = await prisma.apiKey.findFirst({
    where: {
      prefix,
      isActive: true,
    },
    select: { keyHash: true, projectId: true, id: true },
  });

  if (!apiKey) {
    return null;
  }

  const isMatch = await bcrypt.compare(rawKey, apiKey.keyHash);
  if (!isMatch) {
    return null;
  }

  // Update lastUsedAt in background (fire-and-forget)
  prisma.apiKey
    .update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } })
    .catch(() => {}); // non-critical, don't block response

  return { projectId: apiKey.projectId, apiKeyId: apiKey.id };
}
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Validates the API key and returns the associated projectId.
 * Returns null if the key is invalid.
 */
export async function validateApiKey(apiKey: string): Promise<string | null> {
  // Fetch all API keys and compare hashes
  // (bcrypt hashes are non-deterministic, so we can't query by hash directly)
  const apiKeys = await prisma.apiKey.findMany({
    select: { keyHash: true, projectId: true },
  });

  for (const key of apiKeys) {
    const isMatch = await bcrypt.compare(apiKey, key.keyHash);
    if (isMatch) {
      return key.projectId;
    }
  }

  return null;
}
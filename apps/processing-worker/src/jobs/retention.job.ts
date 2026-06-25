import prisma from "@trace-stack/db";

/**
 * Deletes logs older than 24 hours to enforce the free tier retention policy.
 */
export async function runRetentionJob() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const { count } = await prisma.log.deleteMany({
      where: {
        timestamp: {
          lt: twentyFourHoursAgo,
        },
      },
    });

    if (count > 0) {
      console.log(`[Retention Job] Deleted ${count} logs older than 24 hours.`);
    } else {
      console.log("[Retention Job] No old logs to delete.");
    }
  } catch (error) {
    console.error("[Retention Job] Failed to delete old logs:", error);
  }
}

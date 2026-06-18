import { prisma } from "@trace-stack/db";
import { LogQuery } from "@trace-stack/shared";
import { getProjectById } from "./project.service";
import { Prisma } from "@prisma/client";

export async function getLogsForProject(
  userId: string,
  projectId: string,
  query: LogQuery,
) {
  // Ensure the user owns the project
  await getProjectById(userId, projectId);

  const where: Prisma.LogWhereInput = {
    projectId,
  };

  if (query.level) {
    where.level = query.level;
  }
  if (query.serviceName) {
    where.serviceName = query.serviceName;
  }
  if (query.search) {
    // Basic ilike search on message for now
    where.message = { contains: query.search, mode: "insensitive" };
  }

  if (query.startDate || query.endDate) {
    where.timestamp = {};
    if (query.startDate) {
      where.timestamp.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      where.timestamp.lte = new Date(query.endDate);
    }
  }

  const limit = query.limit;
  const page = query.page;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.log.findMany({
      where,
      orderBy: { [query.sortBy]: query.sortOrder },
      skip,
      take: limit,
    }),
    prisma.log.count({ where }),
  ]);

  return {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

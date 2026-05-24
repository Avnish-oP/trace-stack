// Re-export the shared PrismaClient singleton from @trace-stack/db
// All Prisma imports in ingestion-api should go through this file
export { prisma as default, prisma } from "@trace-stack/db";
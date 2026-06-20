import { prisma } from "./packages/db/src/index";

async function main() {
  const users = await prisma.user.findMany();
  const orgs = await prisma.organization.findMany();
  const projects = await prisma.project.findMany();
  const logs = await prisma.log.findMany();
  console.log("LOGS:");
  for (const log of logs) {
    console.log(`- ID: ${log.id}, ProjectId: ${log.projectId}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

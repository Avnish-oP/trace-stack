import { prisma } from "./packages/db/src/index";

async function main() {
  const users = await prisma.user.findMany();
  const orgs = await prisma.organization.findMany();
  const projects = await prisma.project.findMany();
  const keys = await prisma.apiKey.findMany();
  console.log("USERS:", users.length);
  console.log("ORGS:", orgs.length);
  console.log("KEYS:", keys.length);
  for (const k of keys) {
    console.log(`- Prefix: ${k.prefix}, ID: ${k.id}, Active: ${k.isActive}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

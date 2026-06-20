import prisma from "./packages/db/src";

async function main() {
  const keys = await prisma.apiKey.findMany();
  console.log("Found keys:", keys.map(k => ({ id: k.id, name: k.name, prefix: k.prefix, isActive: k.isActive })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

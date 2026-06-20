import { prisma } from "./packages/db/src/index";
import bcrypt from "bcryptjs";
import crypto from "crypto";

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No users found");

  const org = await prisma.organization.create({
    data: {
      name: "Test Org",
      ownerId: user.id
    }
  });

  const project = await prisma.project.create({
    data: {
      name: "Test Project",
      organizationId: org.id
    }
  });

  const rawKey = crypto.randomBytes(32).toString("hex");
  const fullKey = `ts_live_${rawKey}`;
  const prefix = fullKey.substring(0, 12);
  const salt = await bcrypt.genSalt(10);
  const keyHash = await bcrypt.hash(fullKey, salt);

  await prisma.apiKey.create({
    data: {
      name: "Test API Key",
      prefix,
      keyHash,
      projectId: project.id
    }
  });

  console.log("=========================================");
  console.log("GENERATED NEW TEST API KEY:");
  console.log(fullKey);
  console.log("=========================================");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

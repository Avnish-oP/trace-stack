import { prisma } from "@trace-stack/db";
import bcrypt from "bcryptjs";

async function main() {
  const apiKeyStr = "ts_live_7a643ab480aedef655bcc59340b8212181fea003bef2bfe21b68254cb32e382f";
  const prefix = "7a643ab480";
  const token = apiKeyStr.replace("ts_live_", "");
  const hashedKey = await bcrypt.hash(token, 10);

  // We need a dummy project to attach it to
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        passwordHash: "dummyhash",
      }
    });
  }

  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "Test Org",
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: "OWNER"
          }
        }
      }
    });
  }

  let project = await prisma.project.findFirst();
  if (!project) {
    project = await prisma.project.create({
      data: {
        name: "Test Project",
        organizationId: org.id
      }
    });
  }

  await prisma.apiKey.create({
    data: {
      name: "User Provided Key",
      prefix,
      hashedKey,
      projectId: project.id
    }
  });

  console.log("Setup complete. Seeded user's API key.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

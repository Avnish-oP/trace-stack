import { TraceStack } from "../src";
import { prisma } from "@trace-stack/db";
import bcrypt from "bcryptjs";

const TEST_EMAIL = "integration@test.com";

async function main() {
  console.log("Setting up integration test data...");
  
  // Clean up if exists
  const existingUser = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  if (existingUser) {
    await prisma.organization.deleteMany({ where: { ownerId: existingUser.id } });
    await prisma.user.delete({ where: { id: existingUser.id } });
  }

  // 1. Create a test user
  const user = await prisma.user.create({
    data: {
      email: TEST_EMAIL,
      name: "Integration Test User",
      passwordHash: "dummy",
      organizations: {
        create: {
          name: "Test Org",
          projects: {
            create: {
              name: "Test Project",
              environment: "development"
            }
          }
        }
      }
    },
    include: {
      organizations: {
        include: {
          projects: true
        }
      }
    }
  });

  const project = user.organizations[0].projects[0];

  // 2. Create an API key
  const rawKey = "ts_live_integration1234567890";
  // The service strips "ts_" and takes first 8 chars of remainder as prefix
  const keyWithoutIdentifier = rawKey.substring(3); // "live_integration1234567890"
  // Wait, the API_KEY_IDENTIFIER is "ts_". 
  const prefix = keyWithoutIdentifier.substring(0, 8); // "live_int"
  const keyHash = await bcrypt.hash(rawKey, 10);

  const apiKey = await prisma.apiKey.create({
    data: {
      name: "Test API Key",
      prefix,
      keyHash,
      isActive: true,
      projectId: project.id
    }
  });

  console.log("Test data setup complete. Initializing SDK...");

  // 3. Initialize SDK
  const logger = new TraceStack({
    apiKey: rawKey,
    serviceName: "integration-test",
    endpoint: "http://localhost:3002",
    debug: true,
    batchSize: 5,
    flushInterval: 1000
  });

  // 4. Send some logs
  logger.info("Test log 1");
  logger.info("Test log 2");
  logger.info("Test log 3");

  // 5. Force flush
  await logger.flush();
  await logger.destroy();

  // 6. Verify logs in DB
  const logs = await prisma.log.findMany({
    where: { projectId: project.id }
  });

  console.log(`Found ${logs.length} logs in DB for project ${project.id}`);
  
  // 7. Clean up
  await prisma.organization.deleteMany({ where: { ownerId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });

  if (logs.length === 3) {
    console.log("Integration test PASSED!");
  } else {
    console.error("Integration test FAILED! Expected 3 logs.");
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});

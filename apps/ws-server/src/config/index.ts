import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3003),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  API_JWT_SECRET: z
    .string()
    .min(32, "API_JWT_SECRET must be at least 32 characters")
    .default("dev-only-api-jwt-secret-change-before-production"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const config = parsed.data;

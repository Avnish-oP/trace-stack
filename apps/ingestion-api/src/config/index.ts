import { z } from "zod";

// ─── Environment Schema ──────────────────────────────────────

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z
    .string({ error: "DATABASE_URL is required" })
    .url("DATABASE_URL must be a valid URL"),

  REDIS_URL: z
    .string()
    .url("REDIS_URL must be a valid URL")
    .default("redis://localhost:6379"),

  CORS_ORIGIN: z
    .string()
    .default("*"),

  // Rate limiting (per API key)
  RATE_LIMIT_MAX: z.coerce
    .number()
    .int()
    .positive()
    .default(100),

  RATE_LIMIT_WINDOW_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(60),
});

// ─── Parse & Export ──────────────────────────────────────────

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const config = parsed.data;

import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().url().default("http://localhost:3000"),
  API_JWT_SECRET: z
    .string()
    .min(32, "API_JWT_SECRET must be at least 32 characters")
    .default("dev-only-api-jwt-secret-change-before-production"),
  API_JWT_EXPIRES_IN: z.string().default("7d"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("TraceStack <onboarding@resend.dev>"),
  EMAIL_VERIFICATION_EXPIRES_MINUTES: z.coerce
    .number()
    .int()
    .positive()
    .default(60),
  TRUST_PROXY: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

export const config = EnvSchema.parse(process.env);

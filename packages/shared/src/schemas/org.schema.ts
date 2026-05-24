import { z } from "zod";
import { ENVIRONMENTS } from "../constants";

// ─── Organization ────────────────────────────────────────────

export const CreateOrgSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(100, "Organization name must be under 100 characters")
    .trim(),
});

export type CreateOrgInput = z.infer<typeof CreateOrgSchema>;

export const UpdateOrgSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .trim()
    .optional(),
});

export type UpdateOrgInput = z.infer<typeof UpdateOrgSchema>;

// ─── Project ─────────────────────────────────────────────────

export const CreateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be under 100 characters")
    .trim(),
  environment: z.enum(ENVIRONMENTS).default("development"),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  environment: z.enum(ENVIRONMENTS).optional(),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

// ─── API Key ─────────────────────────────────────────────────

export const CreateApiKeySchema = z.object({
  name: z
    .string()
    .min(1, "API key name is required")
    .max(100, "API key name must be under 100 characters")
    .trim(),
  expiresAt: z.string().datetime().optional(),
});

export type CreateApiKeyInput = z.infer<typeof CreateApiKeySchema>;

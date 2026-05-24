import { z } from "zod";

// ─── Register ────────────────────────────────────────────────

export const RegisterSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be under 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be under 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

// ─── Login ───────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// ─── Update Profile ──────────────────────────────────────────

export const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.string().url("Invalid image URL").optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

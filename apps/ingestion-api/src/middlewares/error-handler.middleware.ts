import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// ─── Global Error Handler ────────────────────────────────────

/**
 * Centralized error handling middleware for the ingestion API.
 *
 * Catches:
 * - ZodError → 400 with field-level validation errors
 * - Generic errors → 500 with generic message
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Log unexpected errors
  console.error("[ingestion-api:error]", err);

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}

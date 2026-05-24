import { Request, Response, NextFunction } from "express";

/**
 * Global error-handling middleware.
 *
 * Express recognises this as an error handler because it has four parameters.
 * Must be registered *after* all other middleware and routes.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("[ErrorHandler]", err);

  const statusCode = (err as any).statusCode ?? 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

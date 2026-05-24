import { Response } from "express";

/**
 * Send a standardised success response.
 *
 * @example
 * successResponse(res, { user: { id: 1, name: "Ada" } });
 * // → 200 { success: true, data: { user: { id: 1, name: "Ada" } } }
 */
export function successResponse<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
): void {
  res.status(statusCode).json({
    success: true,
    data,
  });
}

/**
 * Send a standardised error response.
 *
 * @example
 * errorResponse(res, "Invalid credentials", 401);
 * // → 401 { success: false, error: "Invalid credentials" }
 */
export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 400,
): void {
  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

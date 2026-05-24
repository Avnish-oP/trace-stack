import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { errorResponse } from "../utils/apiResponse";

type RequestPart = "body" | "query" | "params";

export function validate(schema: ZodSchema, part: RequestPart = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    req[part] = result.data;
    next();
  };
}

export function validateTokenQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      errorResponse(res, "Invalid or missing verification token", 400);
      return;
    }

    req.query = result.data as Request["query"];
    next();
  };
}

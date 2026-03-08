import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(err.stack || err.message);

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    errors: err.errors,
    // Add stack trace only in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

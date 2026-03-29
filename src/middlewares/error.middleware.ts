import type { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger.js';
import multer from 'multer';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors;

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large. Maximum size is 5MB.';
    } else {
      message = `Upload error: ${err.message}`;
    }
  }

  logger.error(err.stack || err.message);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    errors,
    // Add stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

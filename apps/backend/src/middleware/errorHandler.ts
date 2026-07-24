import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@vaquita/database';
import { logger } from '../config/logger';
import { AppError } from '../lib/errors';
import { env } from '../config/env';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isProd = env.NODE_ENV === 'production';
  
  // Log the error
  logger.error({
    err,
    requestId: req.id,
    url: req.url,
    method: req.method
  }, err.message);

  let statusCode = 500;
  let response: ApiResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProd ? 'An unexpected error occurred' : err.message,
    }
  };

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response.error = {
      code: err.code,
      message: err.message,
      details: err.details
    };
  } else if (err instanceof ZodError) {
    statusCode = 400;
    response.error = {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: err.errors
    };
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    if (err.code === 'P2002') {
      response.error = {
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
        message: 'A unique constraint would be violated.',
        details: err.meta
      };
    } else if (err.code === 'P2025') {
      statusCode = 404;
      response.error = {
        code: 'NOT_FOUND',
        message: 'Record to update or delete not found.',
      };
    } else {
      response.error = {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        details: err.message
      };
    }
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    response.error = {
      code: 'UNAUTHORIZED',
      message: err.message
    };
  }

  // Include stack trace in non-production environments for 500 errors
  if (!isProd && statusCode === 500 && response.error) {
    response.error.details = err.stack;
  }

  res.status(statusCode).json(response);
};

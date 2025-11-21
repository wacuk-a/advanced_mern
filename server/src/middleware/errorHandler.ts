import { Request, Response, NextFunction } from 'express';

// Custom error class for application-specific errors
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error handler wrapper
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handling middleware
export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  console.error('Global Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let errorResponse = {
    success: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Handle AppError instances
  if (err instanceof AppError) {
    errorResponse.message = err.message;
    return res.status(err.statusCode).json(errorResponse);
  }

  // Handle MongoDB duplicate key errors
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    errorResponse.message = `${field} already exists`;
    return res.status(400).json(errorResponse);
  }

  // Handle MongoDB validation errors
  if (err.name === 'ValidationError') {
    errorResponse.message = 'Validation Error';
    return res.status(400).json({
      ...errorResponse,
      details: (err as any).errors
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse.message = 'Invalid token';
    return res.status(401).json(errorResponse);
  }

  if (err.name === 'TokenExpiredError') {
    errorResponse.message = 'Token expired';
    return res.status(401).json(errorResponse);
  }

  // Handle other errors
  const statusCode = (err as any).statusCode || 500;
  res.status(statusCode).json(errorResponse);
};

// 404 handler middleware
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not found - ${req.method} ${req.originalUrl}`, 404);
  next(error);
};

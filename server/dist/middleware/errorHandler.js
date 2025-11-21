"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.globalErrorHandler = exports.asyncHandler = exports.AppError = void 0;
// Custom error class for application-specific errors
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
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
    if (err.name === 'MongoServerError' && err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        errorResponse.message = `${field} already exists`;
        return res.status(400).json(errorResponse);
    }
    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
        errorResponse.message = 'Validation Error';
        return res.status(400).json({
            ...errorResponse,
            details: err.errors
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
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(errorResponse);
};
exports.globalErrorHandler = globalErrorHandler;
// 404 handler middleware
const notFoundHandler = (req, res, next) => {
    const error = new AppError(`Not found - ${req.method} ${req.originalUrl}`, 404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbQueryLogger = exports.performanceMonitor = exports.requestLogger = void 0;
const winston_1 = __importDefault(require("winston"));
// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
// Define level based on environment
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'warn';
};
// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
// Add colors to winston
winston_1.default.addColors(colors);
// Define the format
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
// Define transports
const transports = [
    new winston_1.default.transports.Console(),
    new winston_1.default.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston_1.default.transports.File({ filename: 'logs/all.log' }),
];
// Create the logger
const logger = winston_1.default.createLogger({
    level: level(),
    levels,
    format,
    transports,
});
exports.default = logger;
// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
        if (res.statusCode >= 400) {
            logger.warn(logMessage);
        }
        else {
            logger.http(logMessage);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
// Performance monitoring utility
const performanceMonitor = (operation, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    logger.info(`${operation} took ${(end - start).toFixed(2)}ms`);
    return result;
};
exports.performanceMonitor = performanceMonitor;
// Database query logger
const dbQueryLogger = (query, parameters = [], duration) => {
    logger.debug(`DB Query: ${query} | Params: ${JSON.stringify(parameters)} | Duration: ${duration}ms`);
};
exports.dbQueryLogger = dbQueryLogger;
//# sourceMappingURL=logger.js.map
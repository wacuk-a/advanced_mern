"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUserAuth = exports.requireAuth = exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
// Use the same in-memory session store
const sessions = global.sessions || (global.sessions = {});
// FIX: Get JWT_SECRET at runtime instead of module load time
const getJwtSecret = () => {
    return process.env.JWT_SECRET || "your-secret-key-change-in-production";
};
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
        // ---------------------------------------------------
        // 1. TRY NORMAL USER TOKEN
        // ---------------------------------------------------
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, getJwtSecret());
                const user = await User_1.User.findById(decoded.userId);
                if (user) {
                    req.user = {
                        id: user._id,
                        email: user.email,
                        role: user.role
                    };
                    return next();
                }
            }
            catch (error) {
                // Token is invalid, continue to anonymous session check
            }
        }
        // ---------------------------------------------------
        // 2. TRY ANONYMOUS SESSION
        // ---------------------------------------------------
        const anonymousSessionId = req.headers['x-anonymous-session-id'];
        if (anonymousSessionId && sessions[anonymousSessionId]) {
            req.anonymousSessionId = anonymousSessionId;
            return next();
        }
        // ---------------------------------------------------
        // 3. NO AUTH - STILL ALLOW BUT MARK AS UNAUTHENTICATED
        // ---------------------------------------------------
        return next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return next();
    }
};
exports.authenticate = authenticate;
exports.optionalAuth = exports.authenticate;
const requireAuth = (req, res, next) => {
    if (!req.user && !req.anonymousSessionId) {
        return res.status(401).json({
            error: 'Authentication required',
            code: 'UNAUTHORIZED'
        });
    }
    next();
};
exports.requireAuth = requireAuth;
const requireUserAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: 'User authentication required',
            code: 'USER_AUTH_REQUIRED'
        });
    }
    next();
};
exports.requireUserAuth = requireUserAuth;
//# sourceMappingURL=auth.js.map
// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// Use the same in-memory session store
const sessions: Record<string, any> = (global as any).sessions || ((global as any).sessions = {});

// Fix: Properly extend Express Request with all its properties
export interface AuthRequest extends Request {
  user?: any;
  anonymousSessionId?: string;
}

// FIX: Get JWT_SECRET at runtime instead of module load time
const getJwtSecret = () => {
  return process.env.JWT_SECRET || "your-secret-key-change-in-production";
};

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;

    // ---------------------------------------------------
    // 1. TRY NORMAL USER TOKEN
    // ---------------------------------------------------
    if (token) {
      try {
        const decoded = jwt.verify(token, getJwtSecret()) as any;
        const user = await User.findById(decoded.userId);
        
        if (user) {
          req.user = {
            id: user._id,
            email: user.email,
            role: user.role
          };
          return next();
        }
      } catch (error) {
        // Token is invalid, continue to anonymous session check
      }
    }

    // ---------------------------------------------------
    // 2. TRY ANONYMOUS SESSION
    // ---------------------------------------------------
    const anonymousSessionId = req.headers['x-anonymous-session-id'] as string;
    if (anonymousSessionId && sessions[anonymousSessionId]) {
      req.anonymousSessionId = anonymousSessionId;
      return next();
    }

    // ---------------------------------------------------
    // 3. NO AUTH - STILL ALLOW BUT MARK AS UNAUTHENTICATED
    // ---------------------------------------------------
    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return next();
  }
};

export const optionalAuth = authenticate;

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user && !req.anonymousSessionId) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'UNAUTHORIZED'
    });
  }
  next();
};

export const requireUserAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'User authentication required',
      code: 'USER_AUTH_REQUIRED'
    });
  }
  next();
};

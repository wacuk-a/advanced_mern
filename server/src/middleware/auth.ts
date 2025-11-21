// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// Use the same in-memory session store
const sessions: Record<string, any> = (global as any).sessions || ((global as any).sessions = {});

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
        const jwtSecret = getJwtSecret();
        console.log("Using JWT secret length:", jwtSecret.length);
        
        const decoded = jwt.verify(token, jwtSecret) as any;
        console.log("Decoded token:", decoded);
        
        // FIX: The token contains userId (lowercase d)
        const userId = decoded.userId;

        if (!userId) {
          return res.status(401).json({ error: "Invalid token: no user ID" });
        }

        // For anonymous users, create user object from token
        if (decoded.anonymous) {
          req.user = {
            id: userId,
            role: "user",
            isAnonymous: true
          };
          return next();
        }

        // For regular users, find in database
        const user = await User.findById(userId).select("-password");
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        return next();
      } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ error: "Invalid token" });
      }
    }

    // ---------------------------------------------------
    // 2. TRY ANONYMOUS SESSION
    // ---------------------------------------------------
    const anonymousSessionId = req.headers["x-anonymous-session-id"] as string;

    if (anonymousSessionId && sessions[anonymousSessionId]) {
      req.anonymousSessionId = anonymousSessionId;
      req.user = sessions[anonymousSessionId].user;
      return next();
    }

    return res.status(401).json({ error: "Authentication required" });
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: "Auth error" });
  }
};

// Alias for authenticate - some routes expect "protect"
export const protect = authenticate;

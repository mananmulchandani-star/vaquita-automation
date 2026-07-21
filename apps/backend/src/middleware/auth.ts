import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError, ForbiddenError } from '../lib/errors';
import { prisma } from '../config/database';

export interface AuthPayload {
  userId: string;
  storeId?: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
      id: string;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    
    // Shopify session token handling can be distinguished by token structure or specific headers
    // For this standard JWT implementation:
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
      req.user = decoded;
      
      // Optionally verify user exists in DB
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      
      if (!user || !user.isActive) {
        throw new UnauthorizedError('User account is inactive or not found');
      }
      
      next();
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Required role: ${roles.join(' or ')}`));
    }
    
    next();
  };
};

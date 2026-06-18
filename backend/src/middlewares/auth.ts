import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

interface JwtPayload {
  orgId: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      org?: any;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const org = await prisma.organization.findUnique({
      where: { id: decoded.orgId },
    });

    if (!org) return res.status(401).json({ error: 'Organization not found' });

    req.org = org;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
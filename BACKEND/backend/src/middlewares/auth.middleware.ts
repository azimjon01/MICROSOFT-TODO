// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  userId?: string;
  isAdmin?: boolean;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      isAdmin: boolean;
    };

    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;

    next(); // token to‘g‘ri bo‘lsa, davom etadi
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

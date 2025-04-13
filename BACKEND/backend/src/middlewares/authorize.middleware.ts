// src/middlewares/authorize.middleware.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role?.name !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin permission required' });
  }
  next();
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  if (!req.isAdmin) return res.status(403).json({ message: 'Access denied' });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true
    }
  });

  res.json(users);
};

export const makeUserAdmin = async (req: AuthRequest, res: Response) => {
  if (!req.isAdmin) return res.status(403).json({ message: 'Access denied' });

  const { id } = req.params;

  const user = await prisma.user.update({
    where: { id },
    data: { isAdmin: true }
  });

  res.json({ message: 'User granted admin rights', user });
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  if (!req.isAdmin) return res.status(403).json({ message: 'Access denied' });

  const { id } = req.params;

  await prisma.user.delete({ where: { id } });

  res.status(204).send();
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const createProject = async (req: AuthRequest, res: Response) => {
  const { name, color } = req.body;

  const project = await prisma.project.create({
    data: {
      name,
      color,
      userId: req.userId!
    }
  });

  res.status(201).json(project);
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.userId },
    include: { tasks: true }
  });

  res.json(projects);
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.userId !== req.userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  await prisma.project.delete({ where: { id } });

  res.status(204).send();
};

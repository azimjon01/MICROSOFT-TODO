import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

// Subtask yaratish
export const createSubtask = async (req: AuthRequest, res: Response) => {
  const { taskId, title } = req.body;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.userId !== req.userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const subtask = await prisma.subtask.create({
    data: {
      title,
      taskId
    }
  });

  res.status(201).json(subtask);
};

// Subtask holatini o‘zgartirish
export const toggleSubtask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.subtask.findUnique({ where: { id } });

  if (!existing) return res.status(404).json({ message: 'Not found' });

  const task = await prisma.task.findUnique({ where: { id: existing.taskId } });
  if (!task || task.userId !== req.userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const updated = await prisma.subtask.update({
    where: { id },
    data: { isCompleted: !existing.isCompleted }
  });

  res.json(updated);
};

// Taskga tegishli subtasks’ni olish
export const getSubtasks = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { subtasks: true }
  });

  if (!task || task.userId !== req.userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json(task.subtasks);
};

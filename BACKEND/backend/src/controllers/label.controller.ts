import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Label yaratish
export const createLabel = async (req: Request, res: Response) => {
  const { name, color } = req.body;
  const label = await prisma.label.create({ data: { name, color } });
  res.status(201).json(label);
};

// Taskga label biriktirish
export const addLabelToTask = async (req: Request, res: Response) => {
  const { taskId, labelId } = req.body;

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      labels: {
        connect: { id: labelId }
      }
    },
    include: { labels: true }
  });

  res.json(updatedTask);
};

// Taskdan labelni olib tashlash
export const removeLabelFromTask = async (req: Request, res: Response) => {
  const { taskId, labelId } = req.body;

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      labels: {
        disconnect: { id: labelId }
      }
    },
    include: { labels: true }
  });

  res.json(updatedTask);
};

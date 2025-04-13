import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

const prisma = new PrismaClient();

// Subtask yaratish
export const createSubtask = async (req: AuthRequest, res: Response) => {
  const { taskId, title } = req.body;

  if (!taskId || !title || typeof title !== "string") {
    return res
      .status(400)
      .json({ message: "taskId va title to‘g‘ri formatda bo‘lishi kerak" });
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task || task.userId !== req.userId) {
    return res.status(403).json({ message: "Kirish taqiqlangan" });
  }

  const subtask = await prisma.subtask.create({
    data: { title, taskId },
  });

  res.status(201).json(subtask);
};

// Subtask holatini almashtirish (toggle)
export const toggleSubtask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const subtask = await prisma.subtask.findUnique({ where: { id } });
  if (!subtask) return res.status(404).json({ message: "Subtask topilmadi" });

  const task = await prisma.task.findUnique({ where: { id: subtask.taskId } });
  if (!task || task.userId !== req.userId) {
    return res.status(403).json({ message: "Kirish taqiqlangan" });
  }

  const updated = await prisma.subtask.update({
    where: { id },
    data: { isCompleted: !subtask.isCompleted },
  });

  res.json(updated);
};

// Taskga tegishli barcha subtasks’ni olish
export const getSubtasks = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { subtasks: true },
  });

  if (!task || task.userId !== req.userId) {
    return res.status(403).json({ message: "Kirish taqiqlangan" });
  }

  res.json(task.subtasks);
};

// Subtaskni o‘chirish
export const deleteSubtask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const subtask = await prisma.subtask.findUnique({ where: { id } });
  if (!subtask) return res.status(404).json({ message: "Subtask topilmadi" });

  const task = await prisma.task.findUnique({ where: { id: subtask.taskId } });
  if (!task || task.userId !== req.userId) {
    return res.status(403).json({ message: "Kirish taqiqlangan" });
  }

  await prisma.subtask.delete({ where: { id } });

  res.status(204).send();
};

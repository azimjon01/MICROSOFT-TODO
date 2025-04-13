import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId },
    include: { tags: true }
  });
  res.json(tasks);
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const {
    title,
    description,
    dueDate,
    repeat,
    reminder,
    isImportant,
    isPlanned,
    isMyDay,
    priority,
    tagIds = []
  } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate,
      repeat,
      reminder,
      isImportant,
      isPlanned,
      isMyDay,
      priority,
      userId: req.userId!,
      tags: {
        connect: tagIds.map((id: string) => ({ id }))
      }
    },
    include: { tags: true }
  });

  res.status(201).json(task);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    dueDate,
    repeat,
    reminder,
    isImportant,
    isPlanned,
    isMyDay,
    priority,
    isCompleted,
    tagIds
  } = req.body;

  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      dueDate,
      repeat,
      reminder,
      isImportant,
      isPlanned,
      isMyDay,
      priority,
      isCompleted,
      tags: tagIds
        ? {
            set: tagIds.map((id: string) => ({ id }))
          }
        : undefined
    },
    include: { tags: true }
  });

  res.json(task);
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
};

export const getImportantTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId, isImportant: true },
    include: { tags: true }
  });
  res.json(tasks);
};

export const getPlannedTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId: req.userId,
      isPlanned: true,
      dueDate: { not: null }
    },
    include: { tags: true }
  });
  res.json(tasks);
};

export const getMyDayTasks = async (req: AuthRequest, res: Response) => {
  const today = new Date();
  const start = new Date(today.setHours(0, 0, 0, 0));
  const end = new Date(today.setHours(23, 59, 59, 999));

  const tasks = await prisma.task.findMany({
    where: {
      userId: req.userId,
      isMyDay: true,
      dueDate: { gte: start, lte: end }
    },
    include: { tags: true }
  });
  res.json(tasks);
};

export const completeTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.update({
    where: { id },
    data: { isCompleted: true },
    include: { tags: true }
  });

  res.json(task);
};

export const uncompleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.update({
    where: { id },
    data: { isCompleted: false },
    include: { tags: true }
  });

  res.json(task);
};

export const getCompletedTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId: req.userId,
      isCompleted: true
    },
    include: { tags: true }
  });

  res.json(tasks);
};

export const softDeleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  res.json(task);
};

export const getTrashedTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId: req.userId,
      deletedAt: { not: null },
    },
  });

  res.json(tasks);
};

export const restoreTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.update({
    where: { id },
    data: { deletedAt: null },
  });

  res.json(task);
};

export const assignTagsToTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { tagIds } = req.body; // tagIds: string[]

  const created = await Promise.all(
    tagIds.map((tagId: string) =>
      prisma.taskTag.upsert({
        where: { taskId_tagId: { taskId: id, tagId } },
        update: {},
        create: { taskId: id, tagId },
      })
    )
  );

  res.json(created);
};

export const getTagsForTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const tags = await prisma.taskTag.findMany({
    where: { taskId: id },
    include: { tag: true },
  });

  res.json(tags.map(t => t.tag));
};

export const assignTagsToTask = async (req: AuthRequest, res: Response) => {
  const { id: taskId } = req.params;
  const { tagIds } = req.body as { tagIds: string[] };

  // avval eski bog‘lanishlarni o‘chiramiz
  await prisma.taskTag.deleteMany({ where: { taskId } });

  // yangi bog‘lanishlarni yaratamiz
  const data = tagIds.map(tagId => ({ taskId, tagId }));
  await prisma.taskTag.createMany({ data });

  res.status(200).json({ message: 'Tags assigned successfully' });
};

export const getTagsForTask = async (req: AuthRequest, res: Response) => {
  const { id: taskId } = req.params;

  const tags = await prisma.tag.findMany({
    where: {
      taskTags: {
        some: {
          taskId,
        },
      },
    },
  });

  res.json(tags);
};

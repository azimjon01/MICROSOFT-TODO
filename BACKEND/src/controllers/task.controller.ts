import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

const prisma = new PrismaClient();

// Create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      isImportant,
      isPlanned,
      isMyDay,
      repeat,
      reminder,
      projectId,
      tagIds = [],
    } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        priority,
        isImportant,
        isPlanned,
        isMyDay,
        repeat,
        reminder,
        userId: req.userId!,
        projectId,
        taskTags: {
          create: tagIds.map((tagId: string) => ({ tagId })),
        },
      },
      include: {
        taskTags: {
          include: { tag: true },
        },
        subtasks: true,
        project: true,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// Get all tasks for the user
export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.userId!,
        deletedAt: null,
      },
      include: {
        taskTags: {
          include: { tag: true },
        },
        subtasks: true,
        project: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// Update a task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      dueDate,
      priority,
      isImportant,
      isPlanned,
      isMyDay,
      repeat,
      reminder,
      projectId,
      tagIds = [],
    } = req.body;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.taskTag.deleteMany({ where: { taskId: id } });

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        dueDate,
        priority,
        isImportant,
        isPlanned,
        isMyDay,
        repeat,
        reminder,
        projectId,
        taskTags: {
          create: tagIds.map((tagId: string) => ({ tagId })),
        },
      },
      include: {
        taskTags: {
          include: { tag: true },
        },
        subtasks: true,
        project: true,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// Soft delete a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task || task.userId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// Get tasks by filter type (MyDay, Important, Planned, Completed, Trash)
export const filterTasksByType = async (req: AuthRequest, res: Response) => {
  const { type } = req.params;

  let filter: any = { userId: req.userId!, deletedAt: null };

  switch (type) {
    case "myday":
      filter.isMyDay = true;
      break;
    case "important":
      filter.isImportant = true;
      break;
    case "planned":
      filter.isPlanned = true;
      break;
    case "completed":
      filter.isCompleted = true;
      break;
    case "trash":
      filter.deletedAt = { not: null };
      break;
    default:
      return res.status(400).json({ message: "Invalid filter type" });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: filter,
      include: {
        taskTags: { include: { tag: true } },
        subtasks: true,
        project: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to filter tasks" });
  }
};

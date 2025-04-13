import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

const prisma = new PrismaClient();

// Create tag
export const createTag = async (req: AuthRequest, res: Response) => {
  const { name, color } = req.body;

  try {
    const tag = await prisma.tag.create({
      data: {
        name,
        color,
        userId: req.userId!,
      },
    });

    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Tag yaratishda xatolik yuz berdi' });
  }
};

// Get all tags
export const getTags = async (req: AuthRequest, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      where: { userId: req.userId },
    });

    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Teglarni olishda xatolik yuz berdi' });
  }
};

// Delete tag
export const deleteTag = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.tag.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Tegni o‘chirishda xatolik yuz berdi' });
  }
};

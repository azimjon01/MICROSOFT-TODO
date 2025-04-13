import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { createTag, getTags, deleteTag } from '../controllers/tag.controller';
import { assignTagsToTask, getTagsForTask } from '../controllers/task.controller';

const router = Router();

// Tag CRUD
router.post('/', authenticate, createTag);
router.get('/', authenticate, getTags);
router.delete('/:id', authenticate, deleteTag);

// Task-Tag bog‘lash
router.post('/:id/tags', authenticate, assignTagsToTask);   // Taskga tag biriktirish
router.get('/:id/tags', authenticate, getTagsForTask);      // Task uchun biriktirilgan taglarni olish

export default router;

import express from 'express';
import * as subtaskController from '../controllers/subtask.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.post('/', subtaskController.createSubtask);
router.patch('/:id/toggle', subtaskController.toggleSubtask);
router.get('/:taskId', subtaskController.getSubtasks);

export default router;

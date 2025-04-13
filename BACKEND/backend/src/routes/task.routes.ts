import express from 'express';
import * as taskController from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.get('/special/important', taskController.getImportantTasks);
router.get('/special/planned', taskController.getPlannedTasks);
router.get('/special/myday', taskController.getMyDayTasks);
router.patch('/:id/complete', taskController.completeTask);
router.patch('/:id/uncomplete', taskController.uncompleteTask);
router.get('/special/completed', taskController.getCompletedTasks);

router.get('/trash', authenticate, getTrashedTasks);
router.put('/:id/restore', authenticate, restoreTask);
router.delete('/:id/soft', authenticate, softDeleteTask);

export default router;

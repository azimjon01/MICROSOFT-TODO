import express from 'express';
import * as projectController from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();
router.use(authenticate);

router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.delete('/:id', projectController.deleteProject);

export default router;

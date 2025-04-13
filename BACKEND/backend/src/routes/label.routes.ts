import express from 'express';
import * as labelController from '../controllers/label.controller';

const router = express.Router();

router.post('/', labelController.createLabel);
router.post('/assign', labelController.addLabelToTask);
router.post('/remove', labelController.removeLabelFromTask);

export default router;

import express from 'express';
import {
  getAllUsers,
  makeUserAdmin,
  deleteUser
} from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/users', getAllUsers);
router.patch('/users/:id/make-admin', makeUserAdmin);
router.delete('/users/:id', deleteUser);

export default router;

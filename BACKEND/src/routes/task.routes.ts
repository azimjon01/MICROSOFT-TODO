import { Router, Request, Response, NextFunction } from "express";
import {
  createTask,
  deleteTask,
  updateTask,
  getAllTasks,
  filterTasksByType,
} from "../controllers/task.controller";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

// Wrapper orqali AuthRequest qilish
const withAuth =
  (handler: (req: AuthRequest, res: Response, next: NextFunction) => any) =>
  (req: Request, res: Response, next: NextFunction) =>
    handler(req as AuthRequest, res, next);

// CRUD routes
router.get("/", withAuth(getAllTasks));
router.post("/", withAuth(createTask));
router.put("/:id", withAuth(updateTask));
router.delete("/:id", withAuth(deleteTask));
router.get("/filter/:type", withAuth(filterTasksByType));

export default router;

import { Router, RequestHandler } from "express";
import {
  createSubtask,
  toggleSubtask,
  getSubtasks,
  deleteSubtask,
} from "../controllers/subtask.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

// Subtask yaratish
router.post("/", createSubtask as RequestHandler);

// Subtask holatini toggle qilish
router.patch("/:id/toggle", toggleSubtask as RequestHandler);

// Muayyan taskga tegishli barcha subtasks
router.get("/task/:taskId", getSubtasks as RequestHandler);

// Subtask o‘chirish
router.delete("/:id", deleteSubtask as RequestHandler);

export default router;

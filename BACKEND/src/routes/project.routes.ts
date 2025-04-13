// src/routes/project.routes.ts
import { Router } from "express";
import {
  createProject,
  getProjects,
  deleteProject,
} from "../controllers/project.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", createProject); // ✅ AuthRequest bilan aniq aniqlangan
router.get("/", getProjects); // ✅ AuthRequest bilan aniq aniqlangan
router.delete("/:id", deleteProject); // ✅ AuthRequest bilan aniq aniqlangan

export default router;

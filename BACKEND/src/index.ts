import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Routes
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import labelRoutes from "./routes/label.routes";
import subtaskRoutes from "./routes/subtask.routes";
import projectRoutes from "./routes/project.routes";
import tagRoutes from "./routes/tag.routes";
import adminRoutes from "./routes/admin.routes";

// Background jobs
import "./jobs/reminder.job";
import "./jobs/repeat.job";

// Load env
dotenv.config();

// App instance
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/labels", labelRoutes);
app.use("/api/subtask", subtaskRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Server is running!");
});

// 404 Route fallback
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "❌ Route not found",
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import labelRoutes from './routes/label.routes';
import subtaskRoutes from './routes/subtask.routes';
import './jobs/reminder.job';
import projectRoutes from './routes/project.routes';
import './jobs/repeat.job';
import tagRoutes from './routes/tag.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/subtask', subtaskRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

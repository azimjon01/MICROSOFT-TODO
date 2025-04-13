import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const tasks = await prisma.task.findMany({
    where: {
      repeat: { in: ['daily', 'weekly', 'monthly'] },
      isCompleted: true,
    },
  });

  for (const task of tasks) {
    let shouldRepeat = false;

    const lastDue = task.dueDate ? new Date(task.dueDate) : null;
    const nextDate = new Date();

    if (task.repeat === 'daily') {
      shouldRepeat = true;
      nextDate.setDate(nextDate.getDate() + 1);
    } else if (task.repeat === 'weekly') {
      const last = new Date(task.createdAt);
      if (now.getDay() === last.getDay()) {
        shouldRepeat = true;
        nextDate.setDate(nextDate.getDate() + 7);
      }
    } else if (task.repeat === 'monthly') {
      if (now.getDate() === new Date(task.createdAt).getDate()) {
        shouldRepeat = true;
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
    }

    if (shouldRepeat) {
      await prisma.task.create({
        data: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          userId: task.userId,
          repeat: task.repeat,
          isImportant: task.isImportant,
          isMyDay: false,
          isPlanned: task.isPlanned,
          dueDate: nextDate,
        },
      });

      // Eski taskni complete true saqlab qoldiramiz, yoki xohlasa user delete qiladi
    }
  }
});

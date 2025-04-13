import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { sendReminderEmail } from '../utils/email';

const prisma = new PrismaClient();

// Har 1 daqiqada ishga tushadi
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const nowISO = now.toISOString();

  const upcomingTasks = await prisma.task.findMany({
    where: {
      reminder: {
        lte: now,
      },
      isCompleted: false,
    },
    include: {
      user: true,
    },
  });

  for (const task of upcomingTasks) {
    await sendReminderEmail(
      task.user.email,
      `Eslatma: ${task.title}`,
      `Salom ${task.user.name},\n\nEslatma: "${task.title}" vazifangiz uchun vaqt keldi.\n\nTo Do App`
    );

    // Eslatma yuborilgach uni o‘chirib qo‘yamiz (bir martalik)
    await prisma.task.update({
      where: { id: task.id },
      data: { reminder: null }
    });
  }
});

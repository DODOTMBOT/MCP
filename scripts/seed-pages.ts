import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPages() {
  try {
    // Создаем начальные страницы
    const pages = [
      {
        title: "Dashboard",
        path: "/dashboard",
        description: "Главная страница системы",
        isActive: true,
        order: 1
      },
      {
        title: "Админ панель",
        path: "/admin",
        description: "Административная панель",
        isActive: true,
        order: 2
      },
      {
        title: "Логин",
        path: "/login",
        description: "Страница входа в систему",
        isActive: true,
        order: 3
      },
      {
        title: "Регистрация",
        path: "/register",
        description: "Страница регистрации",
        isActive: true,
        order: 4
      }
    ];

    for (const page of pages) {
      await prisma.page.upsert({
        where: { path: page.path },
        update: page,
        create: page
      });
    }

    console.log('✅ Страницы успешно добавлены в базу данных');
  } catch (error) {
    console.error('❌ Ошибка при добавлении страниц:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPages();

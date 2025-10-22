import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMenu() {
  try {
    // Очищаем существующие данные
    await prisma.menuItem.deleteMany();

    // Создаем корневые пункты меню
    const production = await prisma.menuItem.create({
      data: {
        title: "Производство",
        icon: "🏭",
        description: "Управление производственными процессами",
        order: 1,
        isActive: true
      }
    });

    const personnel = await prisma.menuItem.create({
      data: {
        title: "Персонал",
        icon: "👥",
        description: "Управление персоналом",
        order: 2,
        isActive: true
      }
    });

    const finance = await prisma.menuItem.create({
      data: {
        title: "Финансы",
        icon: "💰",
        description: "Финансовое управление",
        order: 3,
        isActive: true
      }
    });

    const documents = await prisma.menuItem.create({
      data: {
        title: "Документы",
        icon: "📁",
        description: "Управление документами",
        order: 4,
        isActive: true
      }
    });

    const tech = await prisma.menuItem.create({
      data: {
        title: "Техника",
        icon: "📺",
        description: "Управление техникой",
        order: 5,
        isActive: true
      }
    });

    // Создаем подменю для "Производство"
    await prisma.menuItem.createMany({
      data: [
        {
          title: "Маркировки",
          description: "Создание продуктов",
          order: 1,
          parentId: production.id,
          isActive: true
        },
        {
          title: "Чек-листы",
          description: "Контроль процессов",
          order: 2,
          parentId: production.id,
          isActive: true
        },
        {
          title: "Журналы ХАССП",
          description: "Цифровые журналы",
          order: 3,
          parentId: production.id,
          isActive: true
        }
      ]
    });

    // Создаем подменю для "Персонал"
    await prisma.menuItem.createMany({
      data: [
        {
          title: "Обучение",
          description: "Курсы и тесты",
          order: 1,
          parentId: personnel.id,
          isActive: true
        },
        {
          title: "Графики",
          description: "Планирование смен",
          order: 2,
          parentId: personnel.id,
          isActive: true
        },
        {
          title: "Медкнижки",
          description: "Учёт медкнижек",
          order: 3,
          parentId: personnel.id,
          isActive: true
        }
      ]
    });

    // Создаем подменю для "Финансы"
    await prisma.menuItem.createMany({
      data: [
        {
          title: "Учёт кассы",
          description: "Кассовые операции",
          order: 1,
          parentId: finance.id,
          isActive: true
        },
        {
          title: "Отчёты",
          description: "Финансовая отчётность",
          order: 2,
          parentId: finance.id,
          isActive: true
        }
      ]
    });

    // Создаем подменю для "Документы"
    await prisma.menuItem.createMany({
      data: [
        {
          title: "Файлообменник",
          description: "Хранение документов",
          order: 1,
          parentId: documents.id,
          isActive: true
        },
        {
          title: "Акты",
          description: "Документооборот",
          order: 2,
          parentId: documents.id,
          isActive: true
        }
      ]
    });

    // Создаем подменю для "Техника"
    await prisma.menuItem.createMany({
      data: [
        {
          title: "TV-борды",
          description: "Управление экранами",
          order: 1,
          parentId: tech.id,
          isActive: true
        },
        {
          title: "Оборудование",
          description: "Учёт техники",
          order: 2,
          parentId: tech.id,
          isActive: true
        }
      ]
    });

    console.log("✅ Menu data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding menu data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMenu();

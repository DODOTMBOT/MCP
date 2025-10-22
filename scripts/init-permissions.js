const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initPermissions() {
  try {
    console.log('Инициализация разрешений...');

    // Получаем все страницы
    const pages = await prisma.page.findMany();
    console.log(`Найдено страниц: ${pages.length}`);

    // Роли и их разрешения по умолчанию
    const rolePermissions = {
      'OWNER': true,     // Владелец имеет доступ ко всем страницам
      'ADMIN': true,     // Администратор имеет доступ ко всем страницам
      'MANAGER': false,  // Менеджер по умолчанию не имеет доступа
      'PARTNER': false,  // Партнер по умолчанию не имеет доступа
      'EMPLOYEE': false  // Сотрудник по умолчанию не имеет доступа
    };

    // Создаем разрешения для каждой роли и каждой страницы
    for (const role of Object.keys(rolePermissions)) {
      for (const page of pages) {
        await prisma.rolePermission.upsert({
          where: {
            role_pageId: {
              role: role,
              pageId: page.id
            }
          },
          update: {
            canAccess: rolePermissions[role]
          },
          create: {
            role: role,
            pageId: page.id,
            canAccess: rolePermissions[role]
          }
        });
      }
      console.log(`Созданы разрешения для роли: ${role}`);
    }

    console.log('Инициализация разрешений завершена!');
  } catch (error) {
    console.error('Ошибка инициализации разрешений:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initPermissions();

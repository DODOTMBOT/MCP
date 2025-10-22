const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initSidebarMenu() {
  try {
    console.log('Инициализация бокового меню...');

    // Создаем основные пункты бокового меню
    const sidebarMenuItems = [
      {
        title: 'Dashboard',
        icon: 'LayoutDashboard',
        path: '/dashboard',
        order: 1,
        type: 'sidebar'
      },
      {
        title: 'Мои курсы',
        icon: 'BookOpen',
        path: '/courses',
        order: 2,
        type: 'sidebar'
      },
      {
        title: 'Мои классы',
        icon: 'Users',
        path: '/classes',
        order: 3,
        type: 'sidebar'
      },
      {
        title: 'Сообщения',
        icon: 'MessageSquare',
        path: '/messages',
        order: 4,
        type: 'sidebar'
      },
      {
        title: 'Уведомления',
        icon: 'Bell',
        path: '/notifications',
        order: 5,
        type: 'sidebar'
      },
      {
        title: 'Календарь',
        icon: 'Calendar',
        path: '/calendar',
        order: 6,
        type: 'sidebar'
      },
      {
        title: 'Сообщество',
        icon: 'Users2',
        path: '/community',
        order: 7,
        type: 'sidebar'
      },
      {
        title: 'Настройки',
        icon: 'Settings',
        path: '/settings',
        order: 8,
        type: 'sidebar'
      }
    ];

    // Удаляем существующие пункты бокового меню
    await prisma.menuItem.deleteMany({
      where: { type: 'sidebar' }
    });

    // Создаем новые пункты
    for (const item of sidebarMenuItems) {
      await prisma.menuItem.create({
        data: item
      });
    }

    console.log('✅ Боковое меню успешно инициализировано!');
    console.log(`Создано ${sidebarMenuItems.length} пунктов меню`);

  } catch (error) {
    console.error('❌ Ошибка при инициализации бокового меню:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initSidebarMenu();

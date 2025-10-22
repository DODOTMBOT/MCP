const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createOwner() {
  try {
    console.log('Создание владельца платформы...');

    const email = 'owner@platform.com';
    const password = 'owner123';
    const firstName = 'Владелец';
    const lastName = 'Платформы';

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('Пользователь с таким email уже существует. Обновляем роль...');
      
      // Обновляем роль существующего пользователя
      await prisma.user.update({
        where: { email },
        data: { 
          role: 'OWNER',
          firstName: firstName,
          lastName: lastName
        }
      });
      
      console.log('Роль пользователя обновлена на OWNER');
    } else {
      // Создаем нового пользователя
      const passwordHash = await bcrypt.hash(password, 10);
      
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName: firstName,
          lastName: lastName,
          role: 'OWNER'
        }
      });
      
      console.log('Владелец платформы создан:', {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      });
    }

    // Убеждаемся, что у роли OWNER есть доступ ко всем страницам
    const pages = await prisma.page.findMany();
    console.log(`Найдено страниц: ${pages.length}`);

    for (const page of pages) {
      await prisma.rolePermission.upsert({
        where: {
          role_pageId: {
            role: 'OWNER',
            pageId: page.id
          }
        },
        update: {
          canAccess: true
        },
        create: {
          role: 'OWNER',
          pageId: page.id,
          canAccess: true
        }
      });
    }

    console.log('Доступы для роли OWNER настроены');
    console.log('\n=== ДАННЫЕ ДЛЯ ВХОДА ===');
    console.log('Email:', email);
    console.log('Пароль:', password);
    console.log('Роль: OWNER (Владелец)');
    console.log('Доступ: Все страницы платформы');
    console.log('========================\n');

  } catch (error) {
    console.error('Ошибка создания владельца:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createOwner();

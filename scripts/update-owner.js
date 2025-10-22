const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateOwner() {
  try {
    console.log('Обновляем владельца...');
    
    await prisma.user.update({
      where: { email: 'owner@platform.com' },
      data: {
        firstName: 'Владелец',
        lastName: 'Платформы',
      }
    });
    
    console.log('Владелец обновлен!');
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateOwner();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateUsers() {
  try {
    console.log('Обновляем пользователей...');
    
    // Получаем всех пользователей
    const users = await prisma.user.findMany();
    console.log(`Найдено пользователей: ${users.length}`);
    
    for (const user of users) {
      // Если у пользователя есть name, разбиваем его на firstName и lastName
      if (user.name) {
        const nameParts = user.name.trim().split(' ');
        const firstName = nameParts[0] || null;
        const lastName = nameParts.slice(1).join(' ') || null;
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            firstName,
            lastName,
          }
        });
        
        console.log(`Обновлен пользователь ${user.email}: ${firstName} ${lastName}`);
      } else {
        // Если имени нет, устанавливаем значения по умолчанию
        await prisma.user.update({
          where: { id: user.id },
          data: {
            firstName: 'Пользователь',
            lastName: null,
          }
        });
        
        console.log(`Установлены значения по умолчанию для ${user.email}`);
      }
    }
    
    console.log('Обновление завершено!');
  } catch (error) {
    console.error('Ошибка при обновлении пользователей:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUsers();

#!/bin/bash

# 🔄 Скрипт восстановления рабочей версии
# Использование: ./scripts/restore-working.sh

echo "🔄 Восстановление рабочей версии v1.0-working..."

# Проверяем, что мы в Git репозитории
if [ ! -d ".git" ]; then
    echo "❌ Ошибка: Не найден Git репозиторий"
    exit 1
fi

# Сохраняем текущие изменения
echo "💾 Сохранение текущих изменений..."
git stash push -m "Автосохранение перед восстановлением $(date)"

# Откатываемся к рабочей версии
echo "⏪ Откат к рабочей версии v1.0-working..."
git checkout v1.0-working

# Очищаем кеш
echo "🧹 Очистка кеша..."
rm -rf .next
rm -rf node_modules
rm -f package-lock.json

# Переустанавливаем зависимости
echo "📦 Установка зависимостей..."
npm install

# Перегенерируем Prisma Client
echo "🗄️ Генерация Prisma Client..."
npx prisma generate

# Проверяем базу данных
echo "🔍 Проверка базы данных..."
npx prisma db push

echo "✅ Восстановление завершено!"
echo ""
echo "🚀 Для запуска выполните:"
echo "   npm run dev"
echo ""
echo "📋 Проверьте работоспособность:"
echo "   - Авторизация: http://localhost:3000/login"
echo "   - Dashboard: http://localhost:3000/dashboard"
echo "   - Админ-панель: http://localhost:3000/admin"
echo ""
echo "🔄 Для возврата к сохраненным изменениям:"
echo "   git stash pop"

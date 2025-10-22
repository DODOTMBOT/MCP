# 🔄 Инструкция по сохранению и восстановлению

## 📦 Текущее состояние (v1.0-working)

**Дата создания:** $(date)  
**Статус:** ✅ Полностью рабочая версия  
**Git тег:** `v1.0-working`

### ✅ Что работает:
- 🔐 Авторизация и аутентификация (NextAuth v5)
- 🧭 Боковое меню с ролевым доступом
- 🎛️ Админ-панель с карточками управления
- 📄 Страницы админки (/admin/pages, /admin/menu, /admin/roles, /admin/users)
- 🍞 Breadcrumb навигация
- 🔒 Система контроля доступа RBAC
- 🛠️ API endpoints для всех функций
- 🗄️ База данных с правильными ролями и доступами

## 🔄 Способы восстановления

### 1. Git - Основной способ

```bash
# Посмотреть все коммиты
git log --oneline

# Посмотреть теги
git tag

# Откатиться к рабочей версии
git checkout v1.0-working

# Или создать новую ветку из рабочей версии
git checkout -b restore-working v1.0-working
```

### 2. Восстановление базы данных

```bash
# Остановить приложение
# Восстановить из дампа (если есть)
psql -h localhost -U postgres -d checkpoint < backup_YYYYMMDD_HHMMSS.sql

# Или пересоздать базу с миграциями
npx prisma migrate reset
npx prisma db seed
```

### 3. Восстановление зависимостей

```bash
# Удалить node_modules и переустановить
rm -rf node_modules package-lock.json
npm install

# Перегенерировать Prisma Client
npx prisma generate
```

## 🚨 Если что-то сломалось

### Быстрое восстановление:
```bash
# 1. Откатиться к рабочей версии
git checkout v1.0-working

# 2. Переустановить зависимости
rm -rf node_modules
npm install

# 3. Перегенерировать Prisma
npx prisma generate

# 4. Запустить приложение
npm run dev
```

### Полное восстановление:
```bash
# 1. Клонировать репозиторий заново
git clone <repository-url>
cd mpc

# 2. Переключиться на рабочую версию
git checkout v1.0-working

# 3. Установить зависимости
npm install

# 4. Настроить базу данных
npx prisma migrate deploy
npx prisma db seed

# 5. Запустить приложение
npm run dev
```

## 📋 Чек-лист работоспособности

После восстановления проверить:

- [ ] `npm run dev` запускается без ошибок
- [ ] Авторизация работает (логин/пароль)
- [ ] Боковое меню отображается
- [ ] Админ-панель доступна по `/admin`
- [ ] Страницы админки работают:
  - [ ] `/admin/pages`
  - [ ] `/admin/menu`
  - [ ] `/admin/roles`
  - [ ] `/admin/users`
- [ ] Breadcrumb навигация работает
- [ ] Роли пользователей работают корректно

## 🔧 Архитектура проекта

```
mpc/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Страницы аутентификации
│   ├── (protected)/       # Защищенные страницы
│   ├── api/               # API routes
│   └── [...slug]/         # Динамические страницы
├── components/             # React компоненты
│   ├── ui/                # UI компоненты
│   └── sidebar.tsx        # Боковое меню
├── lib/                   # Утилиты
│   ├── auth/              # NextAuth конфигурация
│   ├── access/            # Контроль доступа
│   └── menu/              # Меню утилиты
├── prisma/                # База данных
│   ├── schema.prisma      # Схема БД
│   └── migrations/        # Миграции
└── scripts/               # Скрипты инициализации
```

## 🎯 Ключевые файлы для сохранения

- `app/layout.tsx` - Корневой layout
- `components/sidebar.tsx` - Боковое меню
- `components/client-layout.tsx` - Клиентский layout
- `lib/auth.ts` - NextAuth конфигурация
- `lib/access/checkAccess.ts` - Контроль доступа
- `app/api/sidebar-menu/route.ts` - API меню
- `prisma/schema.prisma` - Схема БД
- `scripts/init-permissions.js` - Инициализация прав

## ⚠️ Важные моменты

1. **Не удалять** файлы из `prisma/migrations/`
2. **Не изменять** структуру базы данных без миграций
3. **Сохранять** `.env` файл с правильными настройками
4. **Тестировать** после каждого изменения
5. **Делать коммиты** перед крупными изменениями

## 🆘 Экстренное восстановление

Если всё сломалось:

```bash
# 1. Сохранить текущие изменения (если нужно)
git stash

# 2. Откатиться к рабочей версии
git reset --hard v1.0-working

# 3. Очистить кеш
rm -rf .next node_modules

# 4. Переустановить всё
npm install
npx prisma generate

# 5. Запустить
npm run dev
```

---
**Создано:** $(date)  
**Версия:** v1.0-working  
**Статус:** ✅ Готово к использованию

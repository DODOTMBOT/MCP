# Проект UnitOne Marketplace Platform — структура

## 📁 Структура проекта

### Основные директории

- **`app/`** — все маршруты Next.js App Router
  - `(auth)/` — страницы аутентификации (login, register)
  - `(protected)/` — защищенные страницы (dashboard, admin, marketplace, partner)
  - `api/` — API endpoints для backend логики
  - `globals.css` — глобальные стили
  - `layout.tsx` — корневой layout

- **`components/`** — UI-компоненты
  - `ui/` — базовые UI компоненты (button, card, input, etc.)
  - `access-guard.tsx` — защита доступа к страницам
  - `layout-wrapper.tsx` — обертка для layout
  - `sidebar.tsx` — боковое меню
  - `navigation.tsx` — навигация

- **`lib/`** — вспомогательные функции и логика
  - `auth/` — функции аутентификации
  - `access/` — проверка доступа
  - `menu/` — логика меню
  - `utils.ts` — общие утилиты
  - `db.ts` — подключение к базе данных

- **`prisma/`** — схема и миграции базы данных
  - `schema.prisma` — схема БД
  - `migrations/` — файлы миграций

- **`reui/config/`** — настройки библиотеки интерфейсов
  - `components.json` — конфигурация shadcn/reUI

- **`scripts/`** — утилиты и вспомогательные скрипты
  - `create-owner.js` — создание владельца платформы
  - `init-permissions.js` — инициализация разрешений
  - `seed-*.ts` — заполнение БД тестовыми данными
  - `update-*.js` — обновление данных

- **`docs/`** — документация проекта
  - `STRUCTURE.md` — описание структуры (этот файл)
  - `BACKUP_RESTORE.md` — инструкции по бэкапам
  - `requirements.md` — техническое задание
  - `README_DEV.md` — документация для разработчиков
  - `logs/` — логи и тесты

- **`archive_backups/`** — архивные данные
  - SQL дампы, бэкапы кода, скриншоты

### Конфигурационные файлы в корне

- **`.gitignore`** — исключения для Git
- **`README.md`** — основная документация
- **`package.json`** — зависимости и скрипты
- **`next.config.js`** — конфигурация Next.js
- **`tsconfig.json`** — конфигурация TypeScript
- **`tailwind.config.js`** — конфигурация Tailwind CSS
- **`docker-compose.yml`** — конфигурация Docker

## 🎯 Принципы организации

### Разделение ответственности
- **UI компоненты** → `components/`
- **Бизнес-логика** → `lib/`
- **Маршруты** → `app/`
- **Конфигурация** → `reui/config/`
- **Документация** → `docs/`

### Именование
- Компоненты: PascalCase (`Button.tsx`)
- Утилиты: camelCase (`getUserRole.ts`)
- Страницы: kebab-case (`user-profile.tsx`)
- API: kebab-case (`user-profile/route.ts`)

### Импорты
- Абсолютные пути: `@/components/ui/button`
- Относительные: `./utils` (только внутри одной папки)
- Внешние библиотеки: `import { useState } from "react"`

## 🚀 Для разработчиков

### Добавление новых компонентов
1. Создайте файл в `components/ui/`
2. Экспортируйте компонент
3. Добавьте в `components/ui/index.ts` (если нужно)

### Добавление новых страниц
1. Создайте `page.tsx` в соответствующей папке `app/`
2. Добавьте защиту доступа через `AccessGuard`
3. Обновите навигацию в `sidebar.tsx`

### Добавление API endpoints
1. Создайте `route.ts` в папке `app/api/`
2. Реализуйте HTTP методы (GET, POST, PUT, DELETE)
3. Добавьте проверку авторизации

## 📝 Примечания

- Все UI компоненты должны быть переиспользуемыми
- Бизнес-логика не должна содержать JSX
- API endpoints должны возвращать JSON
- Документация должна быть актуальной
- Тесты должны покрывать критическую функциональность

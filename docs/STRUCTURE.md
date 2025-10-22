# Проект UnitOne Marketplace Platform — структура

## 📁 Структура проекта

### Основные директории

- **`app/`** — все маршруты Next.js App Router
  - `(auth)/` — страницы аутентификации (login, register)
  - `(protected)/` — защищенные страницы (dashboard, admin, marketplace, partner)
  - `api/` — API endpoints для backend логики
  - `globals.css` — глобальные стили
  - `layout.tsx` — корневой layout

- **`components/`** — UI-компоненты (унифицированная структура)
  - `ui/` — переиспользуемые атомарные элементы (кнопки, поля, модалки)
  - `common/` — общие карточки, таблицы, фильтры, формы
  - `layouts/` — layout компоненты
    - `ProtectedLayout.tsx` — общий layout для всех защищённых страниц
  - `access-guard.tsx` — защита доступа к страницам
  - `layout-wrapper.tsx` — обертка для layout
  - `sidebar.tsx` — боковое меню
  - `navigation.tsx` — навигация

- **`lib/`** — вспомогательные функции и логика
  - `auth/` — функции аутентификации
  - `access/` — проверка доступа
  - `menu/` — логика меню
  - `api-client.ts` — единая обёртка для fetch/axios с обработкой ошибок и JWT
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
- **`.eslintrc.json`** — конфигурация ESLint для Next + TypeScript
- **`prettier.config.js`** — конфигурация Prettier (tabWidth = 2, singleQuote = true)
- **`middleware.ts`** — middleware для защиты маршрутов
- **`README.md`** — основная документация
- **`package.json`** — зависимости и скрипты
- **`next.config.js`** — конфигурация Next.js
- **`tsconfig.json`** — конфигурация TypeScript
- **`tailwind.config.js`** — конфигурация Tailwind CSS
- **`docker-compose.yml`** — конфигурация Docker

## 🎯 Принципы организации

### Разделение ответственности
- **UI компоненты** → `components/`
  - `ui/` — атомарные элементы (кнопки, поля, модалки)
  - `common/` — общие компоненты (карточки, таблицы, фильтры, формы)
    - `forms/` — формы из модулей
    - `tables/` — таблицы
    - `cards/` — карточки
  - `layouts/` — layout компоненты
- **Бизнес-логика** → `lib/`
  - `types/` — централизованные TypeScript типы
  - `utils.ts` — утилиты (cn, formatDate, formatCurrency, etc.)
  - `api-client.ts` — единая обёртка для всех API запросов
- **Маршруты** → `app/`
- **Конфигурация** → `reui/config/`
- **Документация** → `docs/`

### Унифицированная структура
- **Общие компоненты** из `_template` и `marketplace` перенесены в `components/common/`
- **ProtectedLayout** — единый layout для всех защищённых страниц
- **API Client** — единая обёртка для всех API запросов с обработкой ошибок
- **Middleware** — централизованная защита маршрутов
- **Типизация** — все типы в `lib/types/` с импортом через `@/lib/types`

### Именование
- Компоненты: PascalCase (`Button.tsx`)
- Утилиты: camelCase (`getUserRole.ts`)
- Страницы: kebab-case (`user-profile.tsx`)
- API: kebab-case (`user-profile/route.ts`)

### Импорты
- **Абсолютные пути**: `@/components/ui/button`, `@/lib/utils`, `@/app/layout`
- **Относительные**: `./utils` (только внутри одной папки)
- **Внешние библиотеки**: `import { useState } from "react"`
- **API запросы**: `import { api } from "@/lib/api-client"`
- **Типы**: `import { User, Product } from "@/lib/types"`

### Alias-пути в tsconfig.json
```json
{
  "paths": {
    "@/*": ["./*"],
    "@/lib/*": ["lib/*"],
    "@/components/*": ["components/*"],
    "@/app/*": ["app/*"],
    "@/modules/*": ["app/(protected)/*"]
  }
}
```

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

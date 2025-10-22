# Модуль Admin

## Описание
Административный модуль для управления пользователями, ролями, страницами и настройками системы.

## Цели
- Управление пользователями и их ролями
- Настройка прав доступа
- Управление страницами системы
- Мониторинг активности

## Модели данных

### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PARTNER' | 'EMPLOYEE';
  partnerCode?: string;
  partnerId?: string;
  assignedEstablishmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Page
```typescript
interface Page {
  id: string;
  title: string;
  path: string;
  description?: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Role
```typescript
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Права доступа

| Роль | Права |
|------|-------|
| ADMIN | Полный доступ ко всем функциям |
| PARTNER | Управление своими сотрудниками и заведениями |
| EMPLOYEE | Просмотр собственного профиля |

## API Endpoints

### Пользователи
- `GET /api/users` - Получить список пользователей
- `GET /api/users/[id]` - Получить пользователя по ID
- `POST /api/users` - Создать пользователя
- `PUT /api/users/[id]` - Обновить пользователя
- `DELETE /api/users/[id]` - Удалить пользователя

### Страницы
- `GET /api/pages` - Получить список страниц
- `GET /api/pages/[id]` - Получить страницу по ID
- `POST /api/pages` - Создать страницу
- `PUT /api/pages/[id]` - Обновить страницу
- `DELETE /api/pages/[id]` - Удалить страницу

### Роли
- `GET /api/roles` - Получить список ролей
- `GET /api/roles/[id]` - Получить роль по ID
- `POST /api/roles` - Создать роль
- `PUT /api/roles/[id]` - Обновить роль
- `DELETE /api/roles/[id]` - Удалить роль

## Компоненты

### UI компоненты
- `UserTable` - Таблица пользователей
- `UserForm` - Форма создания/редактирования пользователя
- `PageList` - Список страниц
- `PageForm` - Форма создания/редактирования страницы
- `RoleManager` - Управление ролями
- `PermissionMatrix` - Матрица разрешений

### Бизнес-логика
- `userService` - Сервис для работы с пользователями
- `pageService` - Сервис для работы со страницами
- `roleService` - Сервис для работы с ролями
- `permissionService` - Сервис для работы с разрешениями

## Интеграции
- NextAuth.js для аутентификации
- Prisma ORM для работы с БД
- AccessGuard для проверки прав доступа
- Breadcrumb для навигации

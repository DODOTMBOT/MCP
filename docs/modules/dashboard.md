# Модуль Dashboard

## Описание
Главная панель управления с обзором системы и быстрым доступом к основным функциям.

## Цели
- Обзор ключевых метрик
- Быстрый доступ к основным функциям
- Уведомления и алерты
- Персонализация под роль пользователя

## Модели данных

### DashboardStats
```typescript
interface DashboardStats {
  totalUsers: number;
  totalPartners: number;
  totalEstablishments: number;
  totalProducts: number;
  recentActivity: Activity[];
  notifications: Notification[];
}
```

### Activity
```typescript
interface Activity {
  id: string;
  type: 'user_created' | 'establishment_created' | 'product_created';
  description: string;
  userId: string;
  createdAt: Date;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: Date;
}
```

## Права доступа

| Роль | Права |
|------|-------|
| ADMIN | Полный обзор системы, все метрики |
| PARTNER | Обзор своих заведений и сотрудников |
| EMPLOYEE | Обзор назначенного заведения |

## API Endpoints

### Статистика
- `GET /api/dashboard/stats` - Получить статистику
- `GET /api/dashboard/activity` - Получить активность
- `GET /api/dashboard/notifications` - Получить уведомления

## Компоненты

### UI компоненты
- `StatsCard` - Карточка статистики
- `ActivityFeed` - Лента активности
- `NotificationList` - Список уведомлений
- `QuickActions` - Быстрые действия
- `RecentItems` - Недавние элементы

### Бизнес-логика
- `dashboardService` - Сервис для работы с дашбордом
- `statsService` - Сервис для расчета статистики
- `notificationService` - Сервис для работы с уведомлениями

## Интеграции
- Prisma ORM для работы с БД
- NextAuth.js для аутентификации
- AccessGuard для проверки прав доступа
- Breadcrumb для навигации

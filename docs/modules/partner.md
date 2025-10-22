# Модуль Partner

## Описание
Модуль для управления партнерской системой, заведениями и сотрудниками.

## Цели
- Управление заведениями партнера
- Управление сотрудниками
- Назначение сотрудников на заведения
- Мониторинг активности партнера

## Модели данных

### Establishment
```typescript
interface Establishment {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  partnerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Employee (User с partnerId)
```typescript
interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  partnerId: string;
  assignedEstablishmentId?: string;
  role: 'EMPLOYEE';
  createdAt: Date;
  updatedAt: Date;
}
```

## Права доступа

| Роль | Права |
|------|-------|
| PARTNER | Управление своими заведениями и сотрудниками |
| EMPLOYEE | Просмотр назначенного заведения |

## API Endpoints

### Заведения
- `GET /api/partner/establishments` - Получить заведения партнера
- `GET /api/partner/establishments/[id]` - Получить заведение по ID
- `POST /api/partner/establishments` - Создать заведение
- `PUT /api/partner/establishments/[id]` - Обновить заведение
- `DELETE /api/partner/establishments/[id]` - Удалить заведение

### Сотрудники
- `GET /api/partner/employees` - Получить сотрудников партнера
- `GET /api/partner/employees/[id]` - Получить сотрудника по ID
- `POST /api/partner/employees` - Создать сотрудника
- `PUT /api/partner/employees/[id]` - Обновить сотрудника
- `DELETE /api/partner/employees/[id]` - Удалить сотрудника

## Компоненты

### UI компоненты
- `EstablishmentCard` - Карточка заведения
- `EstablishmentList` - Список заведений
- `EstablishmentForm` - Форма создания/редактирования заведения
- `EmployeeTable` - Таблица сотрудников
- `EmployeeForm` - Форма создания/редактирования сотрудника
- `AssignmentManager` - Управление назначениями

### Бизнес-логика
- `establishmentService` - Сервис для работы с заведениями
- `employeeService` - Сервис для работы с сотрудниками
- `assignmentService` - Сервис для управления назначениями

## Интеграции
- Prisma ORM для работы с БД
- NextAuth.js для аутентификации
- AccessGuard для проверки прав доступа
- Breadcrumb для навигации

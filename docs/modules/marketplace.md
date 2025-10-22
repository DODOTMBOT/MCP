# Модуль Marketplace

## Описание
Модуль для управления товарами и категориями в маркетплейсе.

## Цели
- Управление каталогом товаров
- Фильтрация и поиск товаров
- Управление категориями
- Интеграция с партнерской системой

## Модели данных

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  partnerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Права доступа

| Роль | Права |
|------|-------|
| ADMIN | Полный доступ ко всем товарам и категориям |
| PARTNER | Управление своими товарами и категориями |
| EMPLOYEE | Просмотр товаров и категорий |

## API Endpoints

### Товары
- `GET /api/products` - Получить список товаров
- `GET /api/products/[id]` - Получить товар по ID
- `POST /api/products` - Создать товар
- `PUT /api/products/[id]` - Обновить товар
- `DELETE /api/products/[id]` - Удалить товар

### Категории
- `GET /api/categories` - Получить список категорий
- `GET /api/categories/[id]` - Получить категорию по ID
- `POST /api/categories` - Создать категорию
- `PUT /api/categories/[id]` - Обновить категорию
- `DELETE /api/categories/[id]` - Удалить категорию

## Компоненты

### UI компоненты
- `ProductCard` - Карточка товара
- `ProductList` - Список товаров
- `ProductForm` - Форма создания/редактирования товара
- `CategoryTree` - Дерево категорий
- `ProductFilters` - Фильтры товаров

### Бизнес-логика
- `productService` - Сервис для работы с товарами
- `categoryService` - Сервис для работы с категориями
- `searchService` - Сервис поиска и фильтрации

## Интеграции
- Prisma ORM для работы с БД
- Next.js API Routes для backend
- reUI компоненты для UI
- Tailwind CSS для стилизации

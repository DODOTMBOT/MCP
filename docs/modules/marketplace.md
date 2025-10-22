# Модуль Marketplace

## Описание
Модуль для управления товарами и категориями в маркетплейсе с feature-based архитектурой.

## Структура модуля

```
marketplace/
├── page.tsx                    # Главная страница модуля
├── features/                   # Страницы функций
│   ├── list/                  # Список товаров
│   │   └── page.tsx
│   ├── create/                # Создание товара
│   │   └── page.tsx
│   ├── edit/[id]/            # Редактирование товара
│   │   └── page.tsx
│   └── view/[id]/            # Просмотр товара
│       └── page.tsx
├── components/                # UI компоненты модуля
│   ├── ui/                   # Базовые UI компоненты
│   │   └── product-card.tsx
│   ├── layout/               # Layout компоненты
│   └── forms/                # Формы
│       └── product-form.tsx
├── lib/                      # Бизнес-логика модуля
│   ├── services/            # API сервисы
│   │   └── marketplace-service.ts
│   ├── types/               # TypeScript типы
│   │   └── index.ts
│   ├── utils/               # Утилиты
│   │   └── marketplace-utils.ts
│   └── hooks/               # React хуки
│       └── use-marketplace.ts
├── api/                     # API endpoints
│   ├── route.ts            # GET, POST /api/products
│   └── [id]/               # GET, PUT, DELETE /api/products/[id]
│       └── route.ts
└── README.md               # Документация модуля
```

## Цели
- Управление каталогом товаров
- Фильтрация и поиск товаров
- Управление категориями
- Интеграция с партнерской системой
- Аналитика продаж

## Модели данных

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  rating?: number;
  location?: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
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
- `marketplaceService` - Сервис для работы с товарами
- `categoryService` - Сервис для работы с категориями
- `searchService` - Сервис поиска и фильтрации

## Хуки

### useMarketplaceList
```typescript
const { products, loading, error, refresh } = useMarketplaceList(filters);
```

### useMarketplaceItem
```typescript
const { product, loading, error, updateProduct, deleteProduct } = useMarketplaceItem(id);
```

### useCreateMarketplace
```typescript
const { create, loading, error } = useCreateMarketplace();
```

## Утилиты

### Форматирование
- `formatPrice(price: number)` - Форматирование цены
- `formatDate(date: Date)` - Форматирование даты
- `formatRating(rating: number)` - Форматирование рейтинга

### Валидация
- `validateProductData(data)` - Валидация данных товара
- `validateCategoryData(data)` - Валидация данных категории

### Фильтрация
- `filterProducts(products, filters)` - Фильтрация товаров
- `sortProducts(products, sortBy, order)` - Сортировка товаров

## Интеграции
- Prisma ORM для работы с БД
- Next.js API Routes для backend
- reUI компоненты для UI
- Tailwind CSS для стилизации
- NextAuth.js для аутентификации
- AccessGuard для проверки прав доступа

## Примеры использования

### Использование хуков
```tsx
import { useMarketplaceList } from '@/modules/marketplace/lib/hooks/use-marketplace';

function ProductList() {
  const { products, loading, error, refresh } = useMarketplaceList({
    search: 'пицца',
    category: 'Еда',
    inStock: true
  });
  
  return (
    <div>
      {loading && <div>Загрузка...</div>}
      {error && <div>Ошибка: {error}</div>}
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Использование сервисов
```tsx
import { marketplaceService } from '@/modules/marketplace/lib/services/marketplace-service';

async function loadProducts() {
  try {
    const response = await marketplaceService.getProducts({
      search: 'пицца',
      category: 'Еда',
      priceMin: 100,
      priceMax: 1000
    });
    console.log(response.products);
  } catch (error) {
    console.error('Ошибка:', error.message);
  }
}
```
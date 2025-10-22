# Руководство по стилю кода

## 🎯 Общие принципы

### Именование файлов и директорий
- **Компоненты**: PascalCase (`Button.tsx`, `UserCard.tsx`)
- **Страницы**: kebab-case (`user-profile.tsx`, `product-list.tsx`)
- **API routes**: kebab-case (`user-profile/route.ts`)
- **Утилиты**: camelCase (`getUserRole.ts`, `formatDate.ts`)
- **Директории**: kebab-case (`user-management/`, `product-catalog/`)

### Структура компонентов
```tsx
// 1. Импорты (внешние библиотеки, затем внутренние)
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/types';

// 2. Интерфейсы и типы
interface ComponentProps {
  user: User;
  onEdit: (id: string) => void;
}

// 3. Компонент
export function Component({ user, onEdit }: ComponentProps) {
  return (
    <div className="p-4">
      {/* JSX */}
    </div>
  );
}
```

## 🎨 Tailwind CSS токены

### Базовые цвета
```css
/* Фон */
bg-background          /* Основной фон */
bg-muted/20           /* Приглушенный фон */
bg-card               /* Фон карточек */

/* Текст */
text-foreground       /* Основной текст */
text-muted-foreground /* Приглушенный текст */
text-muted            /* Вторичный текст */

/* Границы */
border-border         /* Основные границы */
border-input          /* Границы полей ввода */
```

### Размеры и отступы
```css
/* Отступы */
p-4, p-6              /* Внутренние отступы */
m-4, m-6              /* Внешние отступы */
space-x-2, space-y-4  /* Промежутки между элементами */

/* Радиусы */
rounded-lg            /* Стандартный радиус */
rounded-2xl           /* Большой радиус */
rounded-full          /* Круглый */

/* Тени */
shadow-sm             /* Легкая тень */
shadow-md             /* Средняя тень */
shadow-lg             /* Сильная тень */
```

### Состояния
```css
/* Hover */
hover:bg-muted        /* Приглушенный фон при наведении */
hover:text-foreground /* Основной текст при наведении */

/* Focus */
focus:ring-2          /* Кольцо фокуса */
focus:ring-primary   /* Цвет кольца фокуса */

/* Active */
active:scale-95      /* Уменьшение при нажатии */
```

## 📝 TypeScript

### Интерфейсы
```typescript
// Базовые типы
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Пропсы компонентов
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

// API ответы
interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
```

### Импорты типов
```typescript
// ✅ Правильно
import { User, Product } from '@/lib/types';
import { ButtonProps } from '@/components/ui/button';

// ❌ Неправильно
import { User } from '../../../lib/types';
```

## 🔧 Утилиты

### cn() для объединения классов
```tsx
import { cn } from '@/lib/utils';

// ✅ Правильно
<div className={cn(
  'p-4 rounded-lg',
  isActive && 'bg-primary text-primary-foreground',
  disabled && 'opacity-50 cursor-not-allowed'
)} />

// ❌ Неправильно
<div className={`p-4 rounded-lg ${isActive ? 'bg-primary' : ''}`} />
```

### Форматирование
```typescript
import { formatDate, formatCurrency } from '@/lib/utils';

// Даты
formatDate(new Date()) // "22.10.2024, 21:30"

// Валюты
formatCurrency(1000) // "1 000 ₽"
```

## 📁 Структура файлов

### Компоненты
```
components/
├── ui/                    # Атомарные элементы
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── common/                # Общие компоненты
│   ├── forms/
│   ├── tables/
│   └── cards/
└── layouts/               # Layout компоненты
    └── ProtectedLayout.tsx
```

### Страницы
```
app/
├── (auth)/               # Публичные страницы
│   ├── login/
│   └── register/
├── (protected)/           # Защищенные страницы
│   ├── dashboard/
│   ├── admin/
│   └── marketplace/
└── api/                  # API endpoints
    ├── auth/
    └── users/
```

## 🚫 Что НЕ делать

### Импорты
```typescript
// ❌ Относительные пути
import { Button } from '../../../components/ui/button';
import { User } from '../../lib/types';

// ❌ Inline стили
<div style={{ backgroundColor: '#fff', color: '#000' }} />

// ❌ Устаревшие классы
<div className="text-gray-500 bg-gray-100" />
```

### Компоненты
```tsx
// ❌ Смешивание логики и UI
export function UserList() {
  const [users, setUsers] = useState([]);
  
  // API логика здесь
  useEffect(() => {
    fetch('/api/users').then(/* ... */);
  }, []);
  
  return <div>{/* UI */}</div>;
}

// ✅ Разделение ответственности
export function UserList({ users }: { users: User[] }) {
  return <div>{/* Только UI */}</div>;
}
```

## ✅ Лучшие практики

### Компоненты
- Используйте функциональные компоненты
- Разделяйте логику и UI
- Используйте TypeScript интерфейсы
- Применяйте cn() для условных классов

### Стили
- Используйте Tailwind токены вместо inline стилей
- Применяйте семантические классы
- Избегайте !important
- Используйте responsive дизайн

### Код
- Следуйте принципу DRY (Don't Repeat Yourself)
- Используйте абсолютные импорты
- Применяйте типизацию везде
- Документируйте сложную логику

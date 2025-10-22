/**
 * Типы для модуля Marketplace
 * 
 * Централизованное хранение всех TypeScript типов модуля
 */

export interface Product {
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

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreateData {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  location?: string;
  inStock: boolean;
}

export interface ProductUpdateData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  location?: string;
  inStock?: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  rating?: number;
  location?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryCreateData {
  name: string;
  description?: string;
  parentId?: string;
}

export interface CategoryUpdateData {
  name?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
}

// Типы для компонентов
export interface ProductCardProps {
  product: Product;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export interface ProductListProps {
  products: Product[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export interface CategoryTreeProps {
  categories: Category[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

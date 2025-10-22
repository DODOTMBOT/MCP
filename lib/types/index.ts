/**
 * Централизованные типы для всего приложения
 */

// Базовые типы пользователя
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  OWNER = 'OWNER',
  PARTNER = 'PARTNER',
  POINT = 'POINT',
  EMPLOYEE = 'EMPLOYEE'
}

// Типы для продуктов
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
  partnerId: string;
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

// Типы для заведений
export interface Establishment {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  partnerId: string;
}

export interface Point {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  establishmentId: string;
}

// Типы для HACCP
export interface HaccpRecord {
  id: string;
  title: string;
  description?: string;
  status: HaccpStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export enum HaccpStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Типы для Payroll
export interface PayrollRecord {
  id: string;
  amount: number;
  description?: string;
  status: PayrollStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export enum PayrollStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  REJECTED = 'REJECTED'
}

// Типы для Labeling
export interface LabelingRecord {
  id: string;
  title: string;
  description?: string;
  status: LabelingStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export enum LabelingStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Типы для TV Boards
export interface TvboardRecord {
  id: string;
  title: string;
  content: string;
  status: TvboardStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export enum TvboardStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED'
}

// API типы
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Компонентные типы
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export interface FilterProps {
  search?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
}

// Формы
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface FormData {
  [key: string]: any;
}

// Навигация
export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

// Уведомления
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
}

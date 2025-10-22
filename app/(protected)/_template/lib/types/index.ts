/**
 * Типы для модуля Template
 * 
 * Централизованное хранение всех TypeScript типов модуля
 */

export interface TemplateItem {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface TemplateCreateData {
  name: string;
  description?: string;
}

export interface TemplateUpdateData {
  name?: string;
  description?: string;
}

export interface TemplateFilters {
  search?: string;
  status?: 'active' | 'inactive';
  dateFrom?: Date;
  dateTo?: Date;
  createdBy?: string;
}

export interface TemplateListResponse {
  items: TemplateItem[];
  total: number;
  page: number;
  limit: number;
}

export interface TemplateApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// Типы для форм
export interface TemplateFormData {
  name: string;
  description: string;
}

// Типы для компонентов
export interface TemplateCardProps {
  item: TemplateItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export interface TemplateListProps {
  items: TemplateItem[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}
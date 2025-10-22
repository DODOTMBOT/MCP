/**
 * Типы для модуля
 * 
 * Принципы:
 * - Все типы модуля в одном файле
 * - Экспорт через index.ts
 * - Использование префикса модуля
 */

export interface TemplateItem {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
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
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

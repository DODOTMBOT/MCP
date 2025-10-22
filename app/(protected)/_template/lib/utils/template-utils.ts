/**
 * Утилиты для модуля Template
 * 
 * Вспомогательные функции для работы с данными
 */

import { TemplateItem, TemplateFilters } from "../types";

/**
 * Форматирование даты для отображения
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Форматирование даты для API
 */
export function formatDateForApi(date: Date): string {
  return date.toISOString();
}

/**
 * Парсинг даты из API
 */
export function parseDateFromApi(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Валидация данных формы
 */
export function validateTemplateData(data: { name: string; description?: string }): string[] {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push("Название обязательно");
  }
  
  if (data.name && data.name.length > 100) {
    errors.push("Название не должно превышать 100 символов");
  }
  
  if (data.description && data.description.length > 500) {
    errors.push("Описание не должно превышать 500 символов");
  }
  
  return errors;
}

/**
 * Фильтрация элементов по поисковому запросу
 */
export function filterItems(items: TemplateItem[], search: string): TemplateItem[] {
  if (!search.trim()) return items;
  
  const searchLower = search.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(searchLower) ||
    (item.description && item.description.toLowerCase().includes(searchLower))
  );
}

/**
 * Сортировка элементов
 */
export function sortItems(items: TemplateItem[], sortBy: 'name' | 'createdAt' | 'updatedAt', order: 'asc' | 'desc' = 'asc'): TemplateItem[] {
  return [...items].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

/**
 * Генерация уникального ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Экспорт данных в CSV
 */
export function exportToCsv(items: TemplateItem[]): string {
  const headers = ['ID', 'Название', 'Описание', 'Дата создания', 'Дата обновления'];
  const rows = items.map(item => [
    item.id,
    item.name,
    item.description || '',
    formatDate(item.createdAt),
    formatDate(item.updatedAt)
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csvContent;
}

/**
 * Создание URL для экспорта
 */
export function createExportUrl(filters: TemplateFilters): string {
  const params = new URLSearchParams();
  params.append('export', 'true');
  
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.dateFrom) params.append('dateFrom', formatDateForApi(filters.dateFrom));
  if (filters.dateTo) params.append('dateTo', formatDateForApi(filters.dateTo));
  
  return `/api/template?${params.toString()}`;
}

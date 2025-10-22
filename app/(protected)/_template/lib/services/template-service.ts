/**
 * Сервис для работы с элементами Template
 * 
 * Централизованная бизнес-логика модуля
 */

import { 
  TemplateItem, 
  TemplateCreateData, 
  TemplateUpdateData, 
  TemplateFilters,
  TemplateListResponse,
  TemplateApiError 
} from "../types";

const API_BASE = "/api/template";

class TemplateService {
  /**
   * Получить список элементов с фильтрацией
   */
  async getList(filters: TemplateFilters = {}): Promise<TemplateListResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom.toISOString());
    if (filters.dateTo) params.append("dateTo", filters.dateTo.toISOString());
    if (filters.createdBy) params.append("createdBy", filters.createdBy);

    const response = await fetch(`${API_BASE}?${params.toString()}`);
    
    if (!response.ok) {
      const error: TemplateApiError = await response.json();
      throw new Error(error.message || "Ошибка при загрузке списка");
    }
    
    return response.json();
  }

  /**
   * Получить элемент по ID
   */
  async getById(id: string): Promise<TemplateItem> {
    const response = await fetch(`${API_BASE}/${id}`);
    
    if (!response.ok) {
      const error: TemplateApiError = await response.json();
      throw new Error(error.message || "Ошибка при загрузке элемента");
    }
    
    return response.json();
  }

  /**
   * Создать новый элемент
   */
  async create(data: TemplateCreateData): Promise<TemplateItem> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error: TemplateApiError = await response.json();
      throw new Error(error.message || "Ошибка при создании элемента");
    }
    
    return response.json();
  }

  /**
   * Обновить элемент
   */
  async update(id: string, data: TemplateUpdateData): Promise<TemplateItem> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error: TemplateApiError = await response.json();
      throw new Error(error.message || "Ошибка при обновлении элемента");
    }
    
    return response.json();
  }

  /**
   * Удалить элемент
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const error: TemplateApiError = await response.json();
      throw new Error(error.message || "Ошибка при удалении элемента");
    }
  }

  /**
   * Экспорт данных
   */
  async export(filters: TemplateFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();
    params.append("export", "true");
    
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom.toISOString());
    if (filters.dateTo) params.append("dateTo", filters.dateTo.toISOString());

    const response = await fetch(`${API_BASE}?${params.toString()}`);
    
    if (!response.ok) {
      const error: TemplateApiError = await response.json();
      throw new Error(error.message || "Ошибка при экспорте");
    }
    
    return response.blob();
  }
}

export const templateService = new TemplateService();

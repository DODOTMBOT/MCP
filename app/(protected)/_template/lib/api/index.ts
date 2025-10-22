/**
 * API функции для модуля
 * 
 * Принципы:
 * - Все API вызовы в одном месте
 * - Типизированные функции
 * - Обработка ошибок
 */

import { TemplateItem, TemplateCreateData, TemplateUpdateData, TemplateFilters } from "../types";

const API_BASE = "/api/template";

export async function getTemplateItems(filters?: TemplateFilters): Promise<TemplateItem[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom.toISOString());
  if (filters?.dateTo) params.append("dateTo", filters.dateTo.toISOString());

  const response = await fetch(`${API_BASE}?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Ошибка при загрузке данных");
  }
  return response.json();
}

export async function getTemplateItem(id: string): Promise<TemplateItem> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    throw new Error("Ошибка при загрузке элемента");
  }
  return response.json();
}

export async function createTemplateItem(data: TemplateCreateData): Promise<TemplateItem> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Ошибка при создании элемента");
  }
  return response.json();
}

export async function updateTemplateItem(id: string, data: TemplateUpdateData): Promise<TemplateItem> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Ошибка при обновлении элемента");
  }
  return response.json();
}

export async function deleteTemplateItem(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Ошибка при удалении элемента");
  }
}

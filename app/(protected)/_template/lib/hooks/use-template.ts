/**
 * React хуки для работы с Template модулем
 * 
 * Переиспользуемая логика состояния и API вызовов
 */

import { useState, useEffect, useCallback } from "react";
import { 
  TemplateItem, 
  TemplateCreateData, 
  TemplateUpdateData, 
  TemplateFilters 
} from "../types";
import { templateService } from "../services/template-service";

/**
 * Хук для работы со списком элементов
 */
export function useTemplateList(filters: TemplateFilters = {}) {
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await templateService.getList(filters);
      setItems(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const refresh = useCallback(() => {
    loadItems();
  }, [loadItems]);

  return {
    items,
    loading,
    error,
    total,
    refresh
  };
}

/**
 * Хук для работы с отдельным элементом
 */
export function useTemplateItem(id: string) {
  const [item, setItem] = useState<TemplateItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItem = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getById(id);
      setItem(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  const updateItem = useCallback(async (data: TemplateUpdateData) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const updated = await templateService.update(id, data);
      setItem(updated);
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const deleteItem = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      await templateService.delete(id);
      setItem(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    item,
    loading,
    error,
    updateItem,
    deleteItem,
    refresh: loadItem
  };
}

/**
 * Хук для создания элемента
 */
export function useCreateTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: TemplateCreateData) => {
    try {
      setLoading(true);
      setError(null);
      const item = await templateService.create(data);
      return item;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    create,
    loading,
    error
  };
}

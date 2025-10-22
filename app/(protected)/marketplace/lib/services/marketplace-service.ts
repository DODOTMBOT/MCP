/**
 * Сервис для работы с маркетплейсом
 * 
 * Централизованная бизнес-логика модуля
 */

import { 
  Product, 
  ProductCreateData, 
  ProductUpdateData, 
  ProductFilters,
  ProductListResponse,
  Category,
  CategoryCreateData,
  CategoryUpdateData
} from "../types";

const API_BASE = "/api/products";

class MarketplaceService {
  /**
   * Получить список товаров с фильтрацией
   */
  async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.priceMin) params.append("priceMin", filters.priceMin.toString());
    if (filters.priceMax) params.append("priceMax", filters.priceMax.toString());
    if (filters.inStock !== undefined) params.append("inStock", filters.inStock.toString());
    if (filters.rating) params.append("rating", filters.rating.toString());
    if (filters.location) params.append("location", filters.location);

    const response = await fetch(`${API_BASE}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error("Ошибка при загрузке товаров");
    }
    
    return response.json();
  }

  /**
   * Получить товар по ID
   */
  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/${id}`);
    
    if (!response.ok) {
      throw new Error("Ошибка при загрузке товара");
    }
    
    return response.json();
  }

  /**
   * Создать новый товар
   */
  async createProduct(data: ProductCreateData): Promise<Product> {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error("Ошибка при создании товара");
    }
    
    return response.json();
  }

  /**
   * Обновить товар
   */
  async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error("Ошибка при обновлении товара");
    }
    
    return response.json();
  }

  /**
   * Удалить товар
   */
  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error("Ошибка при удалении товара");
    }
  }

  /**
   * Получить список категорий
   */
  async getCategories(): Promise<Category[]> {
    const response = await fetch("/api/categories");
    
    if (!response.ok) {
      throw new Error("Ошибка при загрузке категорий");
    }
    
    return response.json();
  }

  /**
   * Создать категорию
   */
  async createCategory(data: CategoryCreateData): Promise<Category> {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error("Ошибка при создании категории");
    }
    
    return response.json();
  }

  /**
   * Обновить категорию
   */
  async updateCategory(id: string, data: CategoryUpdateData): Promise<Category> {
    const response = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error("Ошибка при обновлении категории");
    }
    
    return response.json();
  }

  /**
   * Удалить категорию
   */
  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error("Ошибка при удалении категории");
    }
  }

  /**
   * Экспорт товаров
   */
  async exportProducts(filters: ProductFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();
    params.append("export", "true");
    
    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.priceMin) params.append("priceMin", filters.priceMin.toString());
    if (filters.priceMax) params.append("priceMax", filters.priceMax.toString());

    const response = await fetch(`${API_BASE}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error("Ошибка при экспорте товаров");
    }
    
    return response.blob();
  }
}

export const marketplaceService = new MarketplaceService();

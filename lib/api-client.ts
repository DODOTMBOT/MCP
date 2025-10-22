/**
 * Единая обёртка для API запросов
 * 
 * Обработка ошибок, JWT токены, типизация
 */

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

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Базовый метод для API запросов
   */
  async request<T = any>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const fullUrl = `${this.baseUrl}${url}`;
    
    const defaultOptions: RequestInit = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(fullUrl, mergedOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError({
          message: errorData.message || `API ${response.status}: ${response.statusText}`,
          status: response.status,
          code: errorData.code,
        });
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        message: error instanceof Error ? error.message : 'Network error',
        status: 0,
      });
    }
  }

  /**
   * GET запрос
   */
  async get<T = any>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * POST запрос
   */
  async post<T = any>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT запрос
   */
  async put<T = any>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE запрос
   */
  async delete<T = any>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH запрос
   */
  async patch<T = any>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Экспорт по умолчанию
export const api = new ApiClient();

// Экспорт для совместимости
export async function apiRequest<T = any>(url: string, options?: RequestInit): Promise<T> {
  return api.request<T>(url, options);
}

// Утилиты для работы с ошибками
export function isApiError(error: any): error is ApiError {
  return error && typeof error === 'object' && 'status' in error && 'message' in error;
}

export function getErrorMessage(error: any): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error occurred';
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Утилита для объединения классов Tailwind CSS
 * 
 * @param classes - массив классов для объединения
 * @returns объединенная строка классов
 */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

/**
 * Форматирование даты в русском формате
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

/**
 * Форматирование валюты
 */
export function formatCurrency(amount: number, currency: string = 'RUB'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Генерация уникального ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Задержка выполнения
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Проверка на пустое значение
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Безопасное получение вложенного свойства объекта
 */
export function getNestedValue(obj: any, path: string, defaultValue?: any): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
}

/**
 * Дебаунс функция
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Тротлинг функция
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Проверка доступа по пути
 */
export async function checkAccessByPath(path: string): Promise<boolean> {
  try {
    const { prisma } = await import("@/lib/db");
    const { auth } = await import("@/lib/auth");
    const { unstable_noStore: noStore } = await import("next/cache");
    
    noStore();
    const session = await auth();
    const roleName = (session?.user as any)?.role ?? 'EMPLOYEE';
    
    const menu = await prisma.menuItem.findUnique({ where: { path }, select: { id: true } });
    if (!menu) return true; // нет явного пункта в меню — не блокируем
    
    const allowed = await prisma.accessRolePageAccess.findFirst({
      where: { menuItemId: menu.id, canAccess: true, role: { name: roleName } },
      select: { id: true },
    });
    
    return Boolean(allowed);
  } catch (error) {
    console.error('[checkAccessByPath] Ошибка:', error);
    return false; // В случае ошибки блокируем доступ
  }
}

/**
 * Получение доступного меню для роли
 */
export async function getAccessibleMenu(userRoleName: string) {
  try {
    const { prisma } = await import("@/lib/db");
    const { unstable_noStore: noStore } = await import("next/cache");
    
    noStore();
    // Нормализуем роль к нижнему регистру для соответствия с базой данных
    const normalizedRoleName = userRoleName.toLowerCase();
    const role = await prisma.role.findUnique({ where: { name: normalizedRoleName }, select: { id: true } });
    if (!role) return [];

    const items = await prisma.menuItem.findMany({
      where: {
        isActive: true as any, // our schema uses isActive; adapt to active if needed
        accesses: { some: { roleId: role.id, canAccess: true } },
        type: "sidebar",
      },
      orderBy: { order: 'asc' },
      select: { id: true, title: true, path: true },
    });

    return items;
  } catch (error) {
    console.error('[getAccessibleMenu] Ошибка:', error);
    return [];
  }
}
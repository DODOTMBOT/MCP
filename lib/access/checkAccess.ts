"use server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";

export async function checkAccessByPath(path: string): Promise<boolean> {
  try {
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



"use server";
import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

export async function getAccessibleMenu(userRoleName: string) {
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
}



import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - получить разрешения для роли
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    if (!role) {
      return NextResponse.json({ message: "Role parameter is required" }, { status: 400 });
    }

    // Временно возвращаем тестовые данные
    const testData = [
      {
        id: "1",
        title: "Дашборд",
        path: "/dashboard1",
        description: "Главная страница системы",
        canAccess: role === 'OWNER' || role === 'ADMIN'
      },
      {
        id: "2", 
        title: "Админ панель",
        path: "/admin",
        description: "Административная панель",
        canAccess: role === 'OWNER' || role === 'ADMIN'
      },
      {
        id: "3",
        title: "Логин", 
        path: "/login",
        description: "Страница входа в систему",
        canAccess: true
      },
      {
        id: "4",
        title: "Регистрация",
        path: "/register", 
        description: "Страница регистрации",
        canAccess: true
      }
    ];

    return NextResponse.json(testData);
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return NextResponse.json({ message: "Failed to fetch role permissions", error: error.message }, { status: 500 });
  }
}

// POST - обновить разрешения для роли
export async function POST(req: NextRequest) {
  try {
    const { role, permissions } = await req.json();

    if (!role || !permissions) {
      return NextResponse.json({ message: "Role and permissions are required" }, { status: 400 });
    }

    // Обновляем разрешения для каждой страницы
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          role_pageId: {
            role: role,
            pageId: permission.pageId
          }
        },
        update: {
          canAccess: permission.canAccess
        },
        create: {
          role: role,
          pageId: permission.pageId,
          canAccess: permission.canAccess
        }
      });
    }

    return NextResponse.json({ message: "Permissions updated successfully" });
  } catch (error) {
    console.error("Error updating role permissions:", error);
    return NextResponse.json({ message: "Failed to update permissions", error: error.message }, { status: 500 });
  }
}

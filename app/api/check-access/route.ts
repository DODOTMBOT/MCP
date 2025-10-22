import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// POST - проверить доступ пользователя к странице
export async function POST(req: NextRequest) {
  try {
    // Временно возвращаем доступ для тестирования
    // В реальном приложении здесь должна быть проверка сессии
    return NextResponse.json({ 
      canAccess: true, 
      role: "OWNER",
      pageTitle: "Админ панель" 
    });

    const { pagePath } = await req.json();

    if (!pagePath) {
      return NextResponse.json({ message: "Page path is required" }, { status: 400 });
    }

    // Получаем пользователя с его ролью
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!user) {
      return NextResponse.json({ canAccess: false, message: "User not found" }, { status: 404 });
    }

    // Получаем страницу по пути
    const page = await prisma.page.findUnique({
      where: { path: pagePath },
      include: {
        permissions: {
          where: {
            role: user.role
          }
        }
      }
    });

    if (!page) {
      return NextResponse.json({ canAccess: false, message: "Page not found" }, { status: 404 });
    }

    // Проверяем разрешение
    const hasPermission = page.permissions.length > 0 ? page.permissions[0].canAccess : false;

    return NextResponse.json({ 
      canAccess: hasPermission, 
      role: user.role,
      pageTitle: page.title 
    });
  } catch (error) {
    console.error("Error checking access:", error);
    return NextResponse.json({ message: "Failed to check access", error: error.message }, { status: 500 });
  }
}

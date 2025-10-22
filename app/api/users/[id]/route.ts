import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = req.nextUrl.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { error: 'ID пользователя не указан' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        partnerCode: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (user) {
      // Объединяем firstName и lastName в name
      const userWithName = {
        ...user,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
      };
      delete userWithName.firstName;
      delete userWithName.lastName;
      return NextResponse.json(userWithName);
    }

    return NextResponse.json(
      { error: 'Пользователь не найден' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
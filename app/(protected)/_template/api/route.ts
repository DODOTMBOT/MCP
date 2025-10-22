/**
 * API endpoint для модуля
 * 
 * Принципы:
 * - REST API методы
 * - Проверка авторизации
 * - Валидация данных
 * - Обработка ошибок
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Получение параметров фильтрации
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    // Здесь должна быть логика получения данных
    // const items = await prisma.template.findMany({ ... });

    return NextResponse.json([]);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: "Название обязательно" }, { status: 400 });
    }

    // Здесь должна быть логика создания
    // const item = await prisma.template.create({ ... });

    return NextResponse.json({ id: "new-id", name, description });
  } catch (error) {
    console.error("Ошибка при создании:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

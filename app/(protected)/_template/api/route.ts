/**
 * API endpoint для модуля Template
 * 
 * REST API для работы с элементами модуля
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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const exportData = searchParams.get("export");

    // Здесь должна быть логика получения данных из БД
    // const items = await prisma.template.findMany({
    //   where: {
    //     ...(search && { name: { contains: search } }),
    //     ...(status && { status }),
    //     ...(dateFrom && { createdAt: { gte: new Date(dateFrom) } }),
    //     ...(dateTo && { createdAt: { lte: new Date(dateTo) } }),
    //   },
    //   orderBy: { createdAt: 'desc' }
    // });

    // Заглушка для демонстрации
    const items = [
      {
        id: "1",
        name: "Пример элемента",
        description: "Описание элемента",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.id
      }
    ];

    if (exportData) {
      // Логика экспорта данных
      const csvContent = items.map(item => 
        `${item.id},"${item.name}","${item.description || ''}","${item.createdAt.toISOString()}","${item.updatedAt.toISOString()}"`
      ).join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="template-export.csv"'
        }
      });
    }

    return NextResponse.json({
      items,
      total: items.length,
      page: 1,
      limit: 10
    });
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

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Название обязательно" }, { status: 400 });
    }

    if (name.length > 100) {
      return NextResponse.json({ error: "Название не должно превышать 100 символов" }, { status: 400 });
    }

    if (description && description.length > 500) {
      return NextResponse.json({ error: "Описание не должно превышать 500 символов" }, { status: 400 });
    }

    // Здесь должна быть логика создания в БД
    // const item = await prisma.template.create({
    //   data: {
    //     name: name.trim(),
    //     description: description?.trim(),
    //     createdBy: session.user.id
    //   }
    // });

    // Заглушка для демонстрации
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      description: description?.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.id
    };

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
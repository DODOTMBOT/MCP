/**
 * API endpoint для работы с отдельным элементом Template
 * 
 * GET, PUT, DELETE операции для конкретного элемента
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = params;

    // Здесь должна быть логика получения элемента из БД
    // const item = await prisma.template.findUnique({
    //   where: { id }
    // });

    // if (!item) {
    //   return NextResponse.json({ error: "Элемент не найден" }, { status: 404 });
    // }

    // Заглушка для демонстрации
    const item = {
      id,
      name: "Пример элемента",
      description: "Описание элемента",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.id
    };

    return NextResponse.json(item);
  } catch (error) {
    console.error("Ошибка при получении элемента:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { name, description } = body;

    if (name && name.trim().length === 0) {
      return NextResponse.json({ error: "Название не может быть пустым" }, { status: 400 });
    }

    if (name && name.length > 100) {
      return NextResponse.json({ error: "Название не должно превышать 100 символов" }, { status: 400 });
    }

    if (description && description.length > 500) {
      return NextResponse.json({ error: "Описание не должно превышать 500 символов" }, { status: 400 });
    }

    // Здесь должна быть логика обновления в БД
    // const item = await prisma.template.update({
    //   where: { id },
    //   data: {
    //     ...(name && { name: name.trim() }),
    //     ...(description !== undefined && { description: description?.trim() })
    //   }
    // });

    // Заглушка для демонстрации
    const item = {
      id,
      name: name?.trim() || "Обновленное название",
      description: description?.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.id
    };

    return NextResponse.json(item);
  } catch (error) {
    console.error("Ошибка при обновлении элемента:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = params;

    // Здесь должна быть логика удаления из БД
    // await prisma.template.delete({
    //   where: { id }
    // });

    return NextResponse.json({ message: "Элемент успешно удален" });
  } catch (error) {
    console.error("Ошибка при удалении элемента:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

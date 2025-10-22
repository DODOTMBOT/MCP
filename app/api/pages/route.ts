import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET - получить все страницы
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST - создать новую страницу
export async function POST(req: Request) {
  try {
    const { title, path, description, content, isActive, order } = await req.json();
    
    if (!title || !path) {
      return NextResponse.json({ message: "title и path обязательны" }, { status: 400 });
    }

    const existingPage = await prisma.page.findUnique({ where: { path } });
    if (existingPage) {
      return NextResponse.json({ message: "Страница с таким путем уже существует" }, { status: 409 });
    }

    const page = await prisma.page.create({
      data: {
        title,
        path,
        description,
        content: content || "",
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      }
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE - удалить страницу
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ message: "ID страницы обязателен" }, { status: 400 });
    }

    await prisma.page.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Страница успешно удалена" });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

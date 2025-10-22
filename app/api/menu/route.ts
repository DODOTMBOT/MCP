import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET - получить все пункты меню
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { parentId: null }, // Только корневые элементы
      include: {
        children: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST - создать новый пункт меню
export async function POST(req: Request) {
  try {
    const { title, icon, path, description, isActive, order, parentId } = await req.json();
    
    if (!title) {
      return NextResponse.json({ message: "title обязателен" }, { status: 400 });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        title,
        icon: icon || "",
        path: path || null,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
        parentId: parentId || null
      }
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

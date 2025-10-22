import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET - получить пункт меню по ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!menuItem) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT - обновить пункт меню
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, icon, path, description, isActive, order, parentId } = await req.json();
    
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        title,
        icon,
        path,
        description,
        isActive,
        order,
        parentId
      }
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE - удалить пункт меню
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Сначала удаляем все дочерние элементы
    await prisma.menuItem.deleteMany({
      where: { parentId: id }
    });
    
    // Затем удаляем сам элемент
    await prisma.menuItem.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

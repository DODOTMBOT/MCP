import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET - получить страницу по ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const page = await prisma.page.findUnique({
      where: { id }
    });

    if (!page) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT - обновить страницу
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, path, description, content, isActive, order } = await req.json();
    
    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        path,
        description,
        content,
        isActive,
        order
      }
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE - удалить страницу
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.page.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

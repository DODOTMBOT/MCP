import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - получить всех пользователей
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        partner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Failed to fetch users", error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, role } = await req.json();
    if (!userId || !role) {
      return NextResponse.json({ message: "userId и role обязательны" }, { status: 400 });
    }
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, firstName: true, lastName: true, email: true, role: true }
    });
    return NextResponse.json(updated);
  } catch (error:any) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ message: "Failed to update role", error: error.message }, { status: 500 });
  }
}

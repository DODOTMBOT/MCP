import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - получить все роли с пользователями
export async function GET() {
  try {
    // Allowed canonical roles
    const canonicalRoles = ["owner", "partner", "point", "employee"] as const;

    // Get all users, normalize role to lowercase in-memory for grouping (DB should be normalized by script)
    const users = await prisma.user.findMany({
      select: { role: true, firstName: true, lastName: true, email: true }
    });

    const grouped = canonicalRoles.map((r) => ({ role: r, count: 0, users: [] as { firstName: string | null; lastName: string | null; email: string }[] }));

    for (const u of users) {
      const roleLc = (u.role || "").toLowerCase();
      const idx = canonicalRoles.indexOf(roleLc as typeof canonicalRoles[number]);
      if (idx !== -1) {
        grouped[idx].count += 1;
        grouped[idx].users.push({ firstName: u.firstName, lastName: u.lastName, email: u.email });
      }
    }

    return NextResponse.json(grouped);
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    return NextResponse.json({ message: "Failed to fetch roles", error: error.message }, { status: 500 });
  }
}

// DELETE - удалить роль (изменить роль всех пользователей с этой ролью на EMPLOYEE)
export async function DELETE(req: NextRequest) {
  try {
    const { role } = await req.json();

    if (!role) {
      return NextResponse.json({ message: "Role is required" }, { status: 400 });
    }

    const roleLc = String(role).toLowerCase();
    // Проверяем, есть ли пользователи с этой ролью
    const usersWithRole = await prisma.user.findMany({
      where: { role: roleLc },
      select: { id: true, email: true }
    });

    if (usersWithRole.length === 0) {
      return NextResponse.json({ message: "No users found with this role" }, { status: 404 });
    }

    // Изменяем роль всех пользователей с удаляемой ролью на EMPLOYEE
    await prisma.user.updateMany({
      where: { role: roleLc },
      data: { role: 'employee' }
    });

    // Удаляем все разрешения для этой роли
    await prisma.rolePermission.deleteMany({
      where: { role: roleLc }
    });

    return NextResponse.json({ 
      message: `Role "${role}" has been removed. ${usersWithRole.length} users have been reassigned to EMPLOYEE role.`,
      affectedUsers: usersWithRole.length
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json({ message: "Failed to delete role", error: error.message }, { status: 500 });
  }
}
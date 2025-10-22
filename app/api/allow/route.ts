import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export const runtime = "nodejs"; // ensure Node runtime (not Edge)

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path') || '/';
    const session = await auth();
    const roleName = (session?.user as any)?.role ?? 'EMPLOYEE';

    const mi = await prisma.menuItem.findUnique({ where: { path }, select: { id: true } });
    if (!mi) return NextResponse.json({ allow: true });

    const allowed = await prisma.accessRolePageAccess.findFirst({
      where: { menuItemId: mi.id, canAccess: true, role: { name: roleName } },
      select: { id: true },
    });

    if (!allowed) return NextResponse.json({ allow: false }, { status: 403 });
    return NextResponse.json({ allow: true });
  } catch (e) {
    return NextResponse.json({ allow: false }, { status: 403 });
  }
}



import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, role } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: "email и password обязательны" }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ message: "Email уже зарегистрирован" }, { status: 409 });

    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        email, 
        passwordHash, 
        firstName: firstName || null, 
        lastName: lastName || null, 
        role: role || "EMPLOYEE" 
      },
      select: { id: true, email: true },
    });
    return NextResponse.json({ ok: true, id: user.id });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

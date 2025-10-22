import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { partnerCode } = await req.json();
    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: { partnerCode },
      select: { id: true, partnerCode: true }
    });
    return NextResponse.json(updated);
  } catch (e:any) {
    return NextResponse.json({ message: "Failed", error: e.message }, { status: 500 });
  }
}



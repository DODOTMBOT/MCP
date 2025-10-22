import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth(async (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const PUBLIC = ["/login", "/register", "/api/auth", "/_next", "/favicon.ico"];  
  if (PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next();

  const PROTECTED_PREFIXES = ["/admin", "/dashboard", "/partner", "/point"];
  if (!PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next();

  if (!req.auth?.user?.email) return NextResponse.redirect(new URL('/login', req.url));
  // Prisma запретно в middleware (edge). Проверка прав выполняется на сервере в layout/page-guard.
  return NextResponse.next();
});

export const config = { matcher: ["/((?!_next|api|static|favicon.ico).*)"] };

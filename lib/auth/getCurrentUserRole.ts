"use server";
import { auth } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";

export async function getCurrentUserRole(): Promise<string> {
  noStore();
  const session = await auth();
  const role = (session as any)?.role ?? (session?.user as any)?.role;
  return role ?? "EMPLOYEE";
}



import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";

export const authConfig = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: { 
        email: { label: "Email", type: "email" }, 
        password: { label: "Password", type: "password" } 
      },
      authorize: async (creds) => {
        try {
          console.log("[AUTH] Attempting login for:", creds?.email);
          if (!creds?.email || !creds?.password) {
            console.log("[AUTH] Missing credentials");
            return null;
          }
          
          const user = await prisma.user.findUnique({ where: { email: creds.email } });
          if (!user) {
            console.log("[AUTH] User not found:", creds.email);
            return null;
          }
          
          const ok = await compare(creds.password, user.passwordHash);
          if (!ok) {
            console.log("[AUTH] Invalid password for:", creds.email);
            return null;
          }
          
          console.log("[AUTH] Login successful for:", creds.email);
          return { 
            id: user.id, 
            email: user.email, 
            name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.lastName || undefined, 
            role: user.role 
          };
        } catch (e) {
          console.error("[AUTH][authorize] error:", e);
          return null;
        }
      },
    }),
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: { 
    signIn: "/login", 
    error: "/login" 
  },
  callbacks: {
    async jwt({ token, user }) { 
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token; 
    },
    async session({ session, token }) { 
      if (token) {
        (session as any).role = token.role;
        session.user.id = token.id as string;
      }
      return session; 
    },
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

const nextAuth = NextAuth(authConfig);

export const { handlers, auth, signIn, signOut } = nextAuth;

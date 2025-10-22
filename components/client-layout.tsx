"use client";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/sidebar";
import LoadingIndicator from "@/components/loading-indicator";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LoadingIndicator />
      <Sidebar />
      <div className="ml-64">
        {children}
      </div>
    </SessionProvider>
  );
}

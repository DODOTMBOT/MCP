import { ReactNode } from "react";
import { Sidebar } from "@/components/common/Sidebar";
import { Header } from "@/components/common/Header";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const { data: session } = useSession();
  const [items, setItems] = useState<any[]>([]);
  
  useEffect(() => {
    if (session?.user) {
      const role = (session as any)?.role ?? (session.user as any)?.role ?? "EMPLOYEE";
      fetch(`/api/sidebar-menu?role=${role}`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => setItems(data))
        .catch(err => console.error('Error fetching menu:', err));
    }
  }, [session]);
  
  if (!items.length) return null;

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 rounded-tr-3xl flex flex-col p-4 z-50">
      <div className="mb-6">
        <div className="text-white font-bold text-xl">DODO IS</div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {items.map((item) => (
            <Link key={item.id} href={item.path} className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300">
              <span className="font-medium text-sm">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

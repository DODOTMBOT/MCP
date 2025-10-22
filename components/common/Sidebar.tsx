"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export function Sidebar() {
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
    <div className="fixed left-0 top-0 h-screen w-64 rounded-tr-3xl flex flex-col p-4 z-50 bg-slate-900">
      <div className="mb-6">
        <div className="font-bold text-3xl w-full text-center">
          <span className="text-white">Unit</span>
          <span className="text-yellow-500">One</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className="flex items-center p-3 rounded-lg transition-all duration-300 text-white hover:bg-yellow-500 hover:text-white"
            >
              <span className="font-medium text-sm">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-4 pt-4 space-y-3 border-t border-slate-700">
        <div className="p-3 rounded-lg bg-slate-800">
          <div className="text-sm font-medium text-white">
            {session?.user?.name || session?.user?.email || 'Пользователь'}
          </div>
          <div className="text-xs text-slate-400">
            Роль: {(session as any)?.role || 'EMPLOYEE'}
          </div>
          <Link
            href="/profile"
            className="text-xs mt-1 block transition-colors duration-300 text-yellow-500 hover:text-yellow-400"
          >
            Мой профиль →
          </Link>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center p-3 rounded-lg transition-all duration-300 text-white hover:bg-slate-700"
        >
          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium text-sm">Выйти</span>
        </button>
      </div>
    </div>
  );
}

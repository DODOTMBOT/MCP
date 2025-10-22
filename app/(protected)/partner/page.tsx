"use client";

import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";

export default function PartnerDashboardPage() {
  return (
    <LayoutWrapper>
      <AccessGuard requiredRole="partner">
        <div className="min-h-screen bg-background">
          <div className="container mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Панель партнёра</h1>
              <p className="text-muted-foreground">Ключевые показатели и быстрые действия</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl border bg-white">
                <div className="text-sm text-gray-500">Выручка за сегодня</div>
                <div className="text-2xl font-semibold mt-2">—</div>
              </div>
              <div className="p-4 rounded-2xl border bg-white">
                <div className="text-sm text-gray-500">Количество заказов</div>
                <div className="text-2xl font-semibold mt-2">—</div>
              </div>
              <div className="p-4 rounded-2xl border bg-white">
                <div className="text-sm text-gray-500">Средний чек</div>
                <div className="text-2xl font-semibold mt-2">—</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl border bg-white">
                <div className="text-lg font-semibold mb-2">Быстрые действия</div>
                <ul className="space-y-2 text-sm text-blue-600">
                  <li><a href="/admin/pages" className="hover:underline">Управление страницами</a></li>
                  <li><a href="/admin/menu" className="hover:underline">Настроить боковое меню</a></li>
                  <li><a href="/admin/users" className="hover:underline">Пользователи</a></li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl border bg-white">
                <div className="text-lg font-semibold mb-2">Заметки</div>
                <div className="text-sm text-gray-600">Раздел в разработке</div>
              </div>
            </div>
          </div>
        </div>
      </AccessGuard>
    </LayoutWrapper>
  );
}



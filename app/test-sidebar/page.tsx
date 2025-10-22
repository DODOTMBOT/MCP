"use client";

import LayoutWrapper from "@/components/layout-wrapper";

export default function TestSidebarPage() {
  return (
    <LayoutWrapper>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Тест бокового меню</h1>
        <p>Если вы видите боковое меню слева, то все работает правильно!</p>
      </div>
    </LayoutWrapper>
  );
}

"use client";

import LayoutWrapper from "@/components/layout-wrapper";

export default function DemoPage() {
  return (
    <LayoutWrapper>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Демонстрация бокового меню</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">🎯 Основные функции</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Темное боковое меню</li>
              <li>• Логотип и брендинг</li>
              <li>• Пункты меню с иконками</li>
              <li>• Управление через админку</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">📱 Адаптивность</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Сворачивание меню</li>
              <li>• Мобильная версия</li>
              <li>• Гибкая настройка</li>
              <li>• Современный дизайн</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">⚙️ Управление</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Редактирование пунктов</li>
              <li>• Изменение порядка</li>
              <li>• Активация/деактивация</li>
              <li>• Синхронизация с БД</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">✅ Реализованные функции</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <p className="text-sm font-medium">Компонент Sidebar</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <p className="text-sm font-medium">API для меню</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <p className="text-sm font-medium">База данных</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <p className="text-sm font-medium">Админка</p>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}

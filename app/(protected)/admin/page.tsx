import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { checkAccessByPath } from "@/lib/access/checkAccess";
import { notFound } from "next/navigation";

export default async function AdminPage() {
  // Временно разрешаем доступ для роли PLATFORM_OWNER
  // TODO: Восстановить проверку доступа после исправления функции checkAccessByPath

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Админ-панель</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Страницы */}
          <Link href="/admin/pages" className="w-full">
            <Card className="bg-white shadow-sm rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer h-40 w-full">
              <CardContent className="p-6 h-full flex flex-col justify-center">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900">Страницы</h3>
                  <p className="mt-1 text-sm text-gray-500">Все страницы и управление их доступом</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Боковое меню */}
          <Link href="/admin/menu" className="w-full">
            <Card className="bg-white shadow-sm rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer h-40 w-full">
              <CardContent className="p-6 h-full flex flex-col justify-center">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900">Боковое меню</h3>
                  <p className="mt-1 text-sm text-gray-500">Настройка элементов навигации</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Роли и доступы */}
          <Link href="/admin/roles" className="w-full">
            <Card className="bg-white shadow-sm rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer h-40 w-full">
              <CardContent className="p-6 h-full flex flex-col justify-center">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900">Роли и доступы</h3>
                  <p className="mt-1 text-sm text-gray-500">Контроль прав пользователей и ролей</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Пользователи */}
          <Link href="/admin/users" className="w-full">
            <Card className="bg-white shadow-sm rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer h-40 w-full">
              <CardContent className="p-6 h-full flex flex-col justify-center">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900">Пользователи</h3>
                  <p className="mt-1 text-sm text-gray-500">Список и управление пользователями</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import Link from "next/link";
import { Breadcrumb } from "reui";

function AdminRolesContent() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewUsers, setViewUsers] = useState<{ isOpen: boolean, role: any } | null>(null);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleViewUsers = (role: any) => {
    setViewUsers({ isOpen: true, role });
  };

  return (
    <AccessGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Breadcrumb
              className="mb-4"
              items={[
                { label: "Админ-панель", href: "/admin" },
                { label: "Управление ролями", isCurrent: true },
              ]}
            />
            <h1 className="text-3xl font-bold">Управление ролями</h1>
            <p className="text-muted-foreground">Настройка ролей и доступов пользователей</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Роли и доступы</CardTitle>
              <CardDescription>
                Контроль прав пользователей и ролей
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Загрузка...</div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {roles.map((role: any) => (
                      <div key={role.role} className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl bg-white hover:shadow-sm transition-shadow">
                        <div>
                          <h3 className="font-medium">
                            {role.role === 'owner' ? 'Владелец платформы' :
                             role.role === 'partner' ? 'Владелец заведения' :
                             role.role === 'point' ? 'Заведение' :
                             role.role === 'employee' ? 'Сотрудник' : role.role}
                          </h3>
                          <p className="text-sm text-gray-500">{role.count} пользователей</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewUsers(role)}
                            className="h-7 px-2 text-xs"
                          >
                            Просмотр
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* TODO: Delete role */}}
                            className="h-7 px-2 text-xs text-red-600 border-red-300 hover:text-white hover:bg-red-600 hover:border-red-600"
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Диалог просмотра пользователей */}
          {viewUsers?.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white p-6 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-lg">👥</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Пользователи в роли "{viewUsers.role.role}"
                      </h3>
                      <p className="text-sm text-gray-600">
                        Всего пользователей: {viewUsers.role.count}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setViewUsers(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ✕
                  </Button>
                </div>
                
                <ScrollArea className="h-[400px] w-full border border-gray-200 rounded-lg">
                  <div className="p-4 space-y-3">
                    {viewUsers.role.users && viewUsers.role.users.length > 0 ? (
                      viewUsers.role.users.map((user: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-medium">
                                {user.firstName?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Нет пользователей в этой роли
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </div>
    </AccessGuard>
  );
}

export default function AdminRolesPage() {
  return (
    <LayoutWrapper>
      <AdminRolesContent />
    </LayoutWrapper>
  );
}

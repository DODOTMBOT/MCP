"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import Link from "next/link";
import { Breadcrumb } from "reui";

function AdminUsersContent() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    (async () => {
      try {
        const r = await fetch('/api/roles');
        if (r.ok) {
          const data = await r.json();
          const list = data.map((x: any) => x.role).filter(Boolean);
          setRoles(list);
        }
      } catch (e) {}
    })();
  }, []);

  const updateRole = async (userId: string, role: string) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role })
      });
      if (res.ok) {
        const updated = await res.json();
        setAllUsers(prev => prev.map(u => u.id === updated.id ? { ...u, role: updated.role } : u));
      }
    } catch (e) {
      console.error('Failed to update role', e);
    }
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
                { label: "Управление пользователями", isCurrent: true },
              ]}
            />
            <h1 className="text-3xl font-bold">Управление пользователями</h1>
            <p className="text-muted-foreground">Просмотр и управление пользователями системы</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Пользователи системы</CardTitle>
              <CardDescription>
                Список и управление пользователями
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Загрузка данных...</div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {allUsers.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-medium">
                              {user.firstName?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <select
                                value={user.role}
                                onChange={(e) => updateRole(user.id, e.target.value)}
                                className="h-8 px-2 border border-gray-300 rounded-md text-sm bg-white"
                              >
                                {roles.map((r) => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                              </select>
                              {user.partner && (
                                <span className="text-xs text-gray-400">
                                  Партнер: {user.partner.firstName} {user.partner.lastName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AccessGuard>
  );
}

export default function AdminUsersPage() {
  return (
    <LayoutWrapper>
      <AdminUsersContent />
    </LayoutWrapper>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import Link from "next/link";
import { Breadcrumb } from "reui";

function AdminPagesContent() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pages');
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <AccessGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Breadcrumb
              className="mb-4"
              items={[
                { label: "Админ-панель", href: "/admin" },
                { label: "Управление страницами", isCurrent: true },
              ]}
            />
            <h1 className="text-3xl font-bold">Управление страницами</h1>
            <p className="text-muted-foreground">Просмотр и управление страницами системы</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Страницы системы</CardTitle>
              <CardDescription>
                Все страницы и управление их доступом
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Загрузка...</div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {pages.map((page: any) => (
                      <div key={page.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl bg-white hover:shadow-sm transition-shadow">
                        <div>
                          <h3 className="font-medium">{page.title}</h3>
                          <p className="text-sm text-gray-500">{page.path}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={page.isActive ? 'success' : 'secondary'}>
                              {page.isActive ? 'активная' : 'неактивная'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* TODO: Edit page */}}
                            className="h-7 px-2 text-xs"
                          >
                            Редактировать
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* TODO: Delete page */}}
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
        </div>
      </div>
    </AccessGuard>
  );
}

export default function AdminPagesPage() {
  return (
    <LayoutWrapper>
      <AdminPagesContent />
    </LayoutWrapper>
  );
}

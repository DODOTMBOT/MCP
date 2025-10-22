"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Page {
  id: string;
  title: string;
  path: string;
  description?: string;
  content?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function SimpleAdminPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Загрузка страниц
  const fetchPages = async () => {
    try {
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

  // Фильтрация страниц
  const filteredPages = pages.filter(page => 
    !searchTerm.trim() ||
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (page.description && page.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Админ панель - Страницы</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Управление страницами</CardTitle>
          <CardDescription>
            Просмотр и управление страницами сайта
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Поиск */}
          <div className="mb-4">
            <Input
              placeholder="Поиск по названию или пути..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Список страниц */}
          {loading ? (
            <div className="text-center py-4">Загрузка...</div>
          ) : (
            <div className="grid gap-4">
              {filteredPages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">{page.description}</p>
                    <p className="text-xs text-gray-500">Путь: {page.path}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant={page.isActive ? "success" : "secondary"}
                        size="sm"
                      >
                        {page.isActive ? "Активна" : "Неактивна"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Редактировать
                    </Button>
                    <Button variant="destructive" size="sm">
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

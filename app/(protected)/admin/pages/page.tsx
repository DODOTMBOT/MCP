"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Plus, Edit, Trash2, Eye, Calendar, FileText, Settings, MoreHorizontal, ExternalLink } from "lucide-react";

function AdminPagesContent() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    path: '',
    description: '',
    isActive: true
  });

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      } else {
        console.error('Error fetching pages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (page: any) => {
    console.log('View clicked for page:', page);
    console.log('Page path:', page.path);
    
    try {
      // Простая проверка - если путь начинается с /admin, /partner, /profile, /auth - открываем
      if (page.path.startsWith('/admin') || page.path.startsWith('/partner') || page.path.startsWith('/profile') || page.path.startsWith('/auth')) {
        console.log('Opening page:', page.path);
        
        // Используем window.open с дополнительными параметрами
        const newWindow = window.open(
          page.path, 
          '_blank', 
          'noopener,noreferrer,width=1200,height=800,scrollbars=yes,resizable=yes'
        );
        
        if (newWindow) {
          console.log('New window opened successfully');
          newWindow.focus();
        } else {
          console.log('Popup blocked, trying alternative method');
          // Альтернативный метод - создаем ссылку
          const link = document.createElement('a');
          link.href = page.path;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        console.log('Page not found, showing alert');
        alert(`Страница "${page.title}" еще не создана.\nПуть: ${page.path}\nОписание: ${page.description}`);
      }
    } catch (error) {
      console.error('Error in handleView:', error);
      alert('Ошибка при открытии страницы');
    }
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setEditForm({
      title: page.title,
      path: page.path,
      description: page.description || '',
      isActive: page.isActive
    });
  };

  const handleSaveEdit = async () => {
    if (!editingPage) return;

    try {
      const response = await fetch(`/api/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        await fetchPages(); // Обновляем список
        setEditingPage(null);
        setEditForm({ title: '', path: '', description: '', isActive: true });
      } else {
        console.error('Error updating page:', response.statusText);
        alert('Ошибка при обновлении страницы');
      }
    } catch (error) {
      console.error('Error updating page:', error);
      alert('Ошибка при обновлении страницы');
    }
  };

  const handleCancelEdit = () => {
    setEditingPage(null);
    setEditForm({ title: '', path: '', description: '', isActive: true });
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту страницу?')) {
      return;
    }

    try {
      setDeleting(pageId);
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchPages(); // Обновляем список
      } else {
        console.error('Error deleting page:', response.statusText);
        alert('Ошибка при удалении страницы');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Ошибка при удалении страницы');
    } finally {
      setDeleting(null);
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
          
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-sm text-gray-500">
                    {pages.length} страниц в системе
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {/* TODO: Add new page */}}
                  size="sm"
                  className="h-8 px-3 text-xs font-medium bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Добавить
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Загрузка страниц...</p>
                </div>
              ) : pages.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Страниц пока нет</h3>
                  <p className="text-gray-500 mb-4">Создайте первую страницу для начала работы</p>
                  <Button
                    onClick={() => {/* TODO: Add new page */}}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Создать страницу</span>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[300px] text-xs font-medium text-gray-500 uppercase tracking-wider">Страница</TableHead>
                      <TableHead className="w-[200px] text-xs font-medium text-gray-500 uppercase tracking-wider">Путь</TableHead>
                      <TableHead className="w-[100px] text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</TableHead>
                      <TableHead className="w-[120px] text-xs font-medium text-gray-500 uppercase tracking-wider">Дата создания</TableHead>
                      <TableHead className="w-[120px] text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages.map((page: any) => (
                      <TableRow key={page.id} className="hover:bg-gray-50/50 border-b border-gray-100">
                        <TableCell className="py-3">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm text-gray-900 truncate">{page.title}</div>
                            {page.description && (
                              <div className="text-xs text-gray-500 mt-0.5 truncate">{page.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono">
                            {page.path}
                          </code>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge 
                            variant={page.isActive ? "default" : "secondary"}
                            className={`text-xs px-2 py-0.5 ${
                              page.isActive 
                                ? "bg-green-100 text-green-700 border-green-200" 
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            {page.isActive ? "Активна" : "Неактивна"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(page.createdAt).toLocaleDateString('ru-RU')}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center justify-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(page)}
                              className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                              title="Просмотр"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(page)}
                              className="h-7 w-7 p-0 text-gray-400 hover:text-green-600 hover:bg-green-50"
                              title="Редактировать"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(page.id)}
                              disabled={deleting === page.id}
                              className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                              title="Удалить"
                            >
                              {deleting === page.id ? (
                                <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Модальное окно для редактирования */}
          {editingPage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Редактировать страницу</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Путь
                    </label>
                    <input
                      type="text"
                      value={editForm.path}
                      onChange={(e) => setEditForm({ ...editForm, path: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Описание
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editForm.isActive}
                      onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Страница активна
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="px-4 py-2"
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Сохранить
                  </Button>
                </div>
              </div>
            </div>
          )}
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

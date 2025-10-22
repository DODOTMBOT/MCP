"use client";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

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

export default function AdminPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [isCreateMenuDrawerOpen, setIsCreateMenuDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, item: any, type: 'page' | 'menu' } | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    path: "",
    description: "",
    content: "",
    isActive: true,
    order: 0
  });
  const [menuFormData, setMenuFormData] = useState({
    title: "",
    icon: "",
    path: "",
    description: "",
    isActive: true,
    order: 0,
    parentId: null as string | null
  });


  // Фильтрация страниц по поисковому запросу
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPages(pages);
      return;
    }

    const filtered = pages.filter(page => 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (page.description && page.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredPages(filtered);
  }, [searchTerm, pages]);

  // Фильтрация меню по поисковому запросу
  useEffect(() => {
    if (!menuSearchTerm.trim()) {
      setFilteredMenuItems(menuItems);
      return;
    }

    const filtered = menuItems.filter(item => 
      item.title.toLowerCase().includes(menuSearchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(menuSearchTerm.toLowerCase())) ||
      (item.path && item.path.toLowerCase().includes(menuSearchTerm.toLowerCase()))
    );
    
    setFilteredMenuItems(filtered);
  }, [menuSearchTerm, menuItems]);

  // Показать алерт
  const showAlert = (type: 'success' | 'error' | 'warning', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Загрузка страниц
  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      const data = await response.json();
      setPages(data);
      setFilteredPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка меню
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
        setFilteredMenuItems(data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchPages();
    fetchMenuItems();
  }, []);

  // Создание новой страницы
  const handleCreatePage = async () => {
    if (!formData.title.trim() || !formData.path.trim()) {
      showAlert('warning', 'Заполните название и путь страницы');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await fetchPages();
        setIsCreateDrawerOpen(false);
        setFormData({ title: "", path: "", description: "", content: "", isActive: true, order: 0 });
        showAlert('success', 'Страница успешно создана!');
      } else {
        const error = await response.json();
        showAlert('error', `Ошибка: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating page:', error);
      showAlert('error', 'Ошибка при создании страницы');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обновление страницы
  const handleUpdatePage = async () => {
    if (!editingPage) return;
    
    if (!formData.title.trim() || !formData.path.trim()) {
      showAlert('warning', 'Заполните название и путь страницы');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await fetchPages();
        setIsDrawerOpen(false);
        setEditingPage(null);
        setFormData({ title: "", path: "", description: "", content: "", isActive: true, order: 0 });
        showAlert('success', 'Страница успешно обновлена!');
      } else {
        const error = await response.json();
        showAlert('error', `Ошибка: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating page:', error);
      showAlert('error', 'Ошибка при обновлении страницы');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Удаление страницы
  const handleDeletePage = async (id: string) => {
    const page = pages.find(p => p.id === id);
    if (page) {
      setDeleteConfirm({ isOpen: true, item: page, type: 'page' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      const response = await fetch(`/api/${deleteConfirm.type === 'page' ? 'pages' : 'menu'}/${deleteConfirm.item.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        if (deleteConfirm.type === 'page') {
          await fetchPages();
          showAlert('success', 'Страница успешно удалена!');
        } else {
          await fetchMenuItems();
          showAlert('success', 'Пункт меню успешно удален!');
        }
      } else {
        const error = await response.json();
        showAlert('error', `Ошибка: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showAlert('error', 'Ошибка при удалении');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Функции для работы с меню
  const handleCreateMenuItem = async () => {
    if (!menuFormData.title.trim()) {
      showAlert('warning', 'Заполните название пункта меню');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuFormData)
      });
      
      if (response.ok) {
        await fetchMenuItems();
        setIsCreateMenuDrawerOpen(false);
        setMenuFormData({ title: "", icon: "", path: "", description: "", isActive: true, order: 0, parentId: null });
        showAlert('success', 'Пункт меню успешно создан!');
      } else {
        const error = await response.json();
        showAlert('error', `Ошибка: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating menu item:', error);
      showAlert('error', 'Ошибка при создании пункта меню');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMenuItem = async () => {
    if (!editingMenuItem || !menuFormData.title.trim()) {
      showAlert('warning', 'Заполните название пункта меню');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/menu/${editingMenuItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuFormData)
      });
      
      if (response.ok) {
        await fetchMenuItems();
        setIsMenuDrawerOpen(false);
        setEditingMenuItem(null);
        setMenuFormData({ title: "", icon: "", path: "", description: "", isActive: true, order: 0, parentId: null });
        showAlert('success', 'Пункт меню успешно обновлен!');
      } else {
        const error = await response.json();
        showAlert('error', `Ошибка: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      showAlert('error', 'Ошибка при обновлении пункта меню');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    const menuItem = menuItems.find(m => m.id === id) || menuItems.flatMap(m => m.children || []).find(c => c.id === id);
    if (menuItem) {
      setDeleteConfirm({ isOpen: true, item: menuItem, type: 'menu' });
    }
  };

  const openEditMenuItem = (menuItem: any) => {
    setEditingMenuItem(menuItem);
    setMenuFormData({
      title: menuItem.title,
      icon: menuItem.icon || "",
      path: menuItem.path || "",
      description: menuItem.description || "",
      isActive: menuItem.isActive,
      order: menuItem.order,
      parentId: menuItem.parentId
    });
    setIsMenuDrawerOpen(true);
  };


  // Открытие диалога редактирования
  const openEditDialog = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      path: page.path,
      description: page.description || "",
      content: page.content || "",
      isActive: page.isActive,
      order: page.order
    });
    setIsDrawerOpen(true);
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Основной контент */}
      <div className="container mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Административная панель</h1>
              <p className="text-muted-foreground">Управление системой Check-Point</p>
            </div>
            
            {/* Алерты */}
            {alert && (
              <Alert variant={alert.type === 'success' ? 'success' : alert.type === 'error' ? 'destructive' : 'warning'} className="mb-6">
                {alert.type === 'success' && <CheckCircle className="h-4 w-4" />}
                {alert.type === 'error' && <XCircle className="h-4 w-4" />}
                {alert.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                <div className="flex-1">
                  <AlertTitle>
                    {alert.type === 'success' ? 'Успешно' : alert.type === 'error' ? 'Ошибка' : 'Внимание'}
                  </AlertTitle>
                  <AlertDescription>
                    {alert.message}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAlert(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </Alert>
            )}

        
        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pages">📄 Страницы</TabsTrigger>
            <TabsTrigger value="menu">🍔 Меню</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pages" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Управление страницами</CardTitle>
                    <CardDescription>
                      Просмотр и управление страницами системы
                    </CardDescription>
                  </div>
                  <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button>+ Добавить страницу</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Создать новую страницу</DrawerTitle>
                        <DrawerDescription>
                          Заполните информацию о новой странице
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Название</label>
                          <Input
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="Название страницы"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Путь</label>
                          <Input
                            value={formData.path}
                            onChange={(e) => setFormData({...formData, path: e.target.value})}
                            placeholder="/path"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Описание</label>
                          <Input
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Описание страницы"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Порядок</label>
                          <Input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                            placeholder="0"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Контент (HTML)</label>
                          <textarea
                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            placeholder="<p>Ваш HTML контент здесь...</p>"
                          />
                        </div>
                      </div>
                      <DrawerFooter>
                        <Button variant="outline" onClick={() => setIsCreateDrawerOpen(false)}>
                          Отмена
                        </Button>
                        <Button onClick={handleCreatePage} disabled={isSubmitting}>
                          {isSubmitting ? "Создание..." : "Создать"}
                        </Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Загрузка...</div>
                ) : (
                  <div className="space-y-4">
                    {/* Простой поиск */}
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Поиск по названию или пути..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchTerm('')}
                        >
                          Очистить
                        </Button>
                      </div>
                    </div>
                    
                    {/* Список страниц */}
                    <div className="grid gap-4">
                      {filteredPages.map((page) => (
                      <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-medium">{page.title}</h3>
                              <p className="text-sm text-muted-foreground">{page.description}</p>
                              <p className="text-xs text-gray-500">Путь: {page.path}</p>
                              <p className="text-xs text-blue-600">
                                <a href={page.path} target="_blank" rel="noopener noreferrer">
                                  🔗 Открыть страницу
                                </a>
                              </p>
                              <p className="text-xs text-gray-400">
                                Обновлено: {new Date(page.updatedAt).toLocaleString('ru-RU')}
                              </p>
                            </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={page.isActive ? "success" : "secondary"}
                            size="sm"
                          >
                            {page.isActive ? "Активна" : "Неактивна"}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => openEditDialog(page)}
                          >
                            Редактировать
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleDeletePage(page.id)}
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

            {/* Drawer редактирования */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Редактировать страницу</DrawerTitle>
                  <DrawerDescription>
                    Измените информацию о странице
                  </DrawerDescription>
                </DrawerHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Название</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Название страницы"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Путь</label>
                    <Input
                      value={formData.path}
                      onChange={(e) => setFormData({...formData, path: e.target.value})}
                      placeholder="/path"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Описание</label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Описание страницы"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Порядок</label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Контент (HTML)</label>
                    <textarea
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="<p>Ваш HTML контент здесь...</p>"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    <label htmlFor="isActive" className="text-sm font-medium">
                      Активна
                    </label>
                  </div>
                </div>
                <DrawerFooter>
                  <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={handleUpdatePage} disabled={isSubmitting}>
                    {isSubmitting ? "Сохранение..." : "Сохранить"}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </TabsContent>
          
          <TabsContent value="menu" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Управление меню</CardTitle>
                    <CardDescription>
                      Настройка навигационного меню системы
                    </CardDescription>
                  </div>
                  <Button onClick={() => setIsCreateMenuDrawerOpen(true)}>
                    ➕ Добавить пункт меню
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Поиск по меню */}
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Поиск по названию или описанию..."
                      value={menuSearchTerm}
                      onChange={(e) => setMenuSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMenuSearchTerm('')}
                    >
                      Очистить
                    </Button>
                  </div>
                </div>

                {/* Список пунктов меню */}
                <div className="mt-4 space-y-4">
                  {filteredMenuItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant={item.isActive ? "success" : "secondary"}
                                size="sm"
                              >
                                {item.isActive ? "Активен" : "Неактивен"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Порядок: {item.order}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => openEditMenuItem(item)}
                          >
                            Редактировать
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleDeleteMenuItem(item.id)}
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                      
                      {/* Подменю */}
                      {item.children && item.children.length > 0 && (
                        <div className="mt-3 ml-8 space-y-2">
                          {item.children.map((child: any) => (
                            <div key={child.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{child.title}</span>
                                <Badge 
                                  variant={child.isActive ? "success" : "secondary"}
                                  size="sm"
                                >
                                  {child.isActive ? "Активен" : "Неактивен"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => openEditMenuItem(child)}
                                >
                                  ✏️
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleDeleteMenuItem(child.id)}
                                >
                                  🗑️
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Drawer для создания пункта меню */}
        <Drawer open={isCreateMenuDrawerOpen} onOpenChange={setIsCreateMenuDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Создать пункт меню</DrawerTitle>
              <DrawerDescription>
                Добавьте новый пункт в навигационное меню
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Название</label>
                <Input
                  value={menuFormData.title}
                  onChange={(e) => setMenuFormData({...menuFormData, title: e.target.value})}
                  placeholder="Введите название пункта меню"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Иконка</label>
                <Input
                  value={menuFormData.icon}
                  onChange={(e) => setMenuFormData({...menuFormData, icon: e.target.value})}
                  placeholder="🏭 (эмодзи или текст)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Путь (URL)</label>
                <Input
                  value={menuFormData.path}
                  onChange={(e) => setMenuFormData({...menuFormData, path: e.target.value})}
                  placeholder="/path (опционально)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Описание</label>
                <Input
                  value={menuFormData.description}
                  onChange={(e) => setMenuFormData({...menuFormData, description: e.target.value})}
                  placeholder="Описание пункта меню"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Порядок</label>
                <Input
                  type="number"
                  value={menuFormData.order}
                  onChange={(e) => setMenuFormData({...menuFormData, order: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="menuActive"
                  checked={menuFormData.isActive}
                  onChange={(e) => setMenuFormData({...menuFormData, isActive: e.target.checked})}
                />
                <label htmlFor="menuActive" className="text-sm font-medium">Активен</label>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleCreateMenuItem} disabled={isSubmitting}>
                {isSubmitting ? "Создание..." : "Создать"}
              </Button>
              <Button variant="outline" onClick={() => setIsCreateMenuDrawerOpen(false)}>
                Отмена
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Drawer для редактирования пункта меню */}
        <Drawer open={isMenuDrawerOpen} onOpenChange={setIsMenuDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Редактировать пункт меню</DrawerTitle>
              <DrawerDescription>
                Измените параметры пункта меню
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Название</label>
                <Input
                  value={menuFormData.title}
                  onChange={(e) => setMenuFormData({...menuFormData, title: e.target.value})}
                  placeholder="Введите название пункта меню"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Иконка</label>
                <Input
                  value={menuFormData.icon}
                  onChange={(e) => setMenuFormData({...menuFormData, icon: e.target.value})}
                  placeholder="🏭 (эмодзи или текст)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Путь (URL)</label>
                <Input
                  value={menuFormData.path}
                  onChange={(e) => setMenuFormData({...menuFormData, path: e.target.value})}
                  placeholder="/path (опционально)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Описание</label>
                <Input
                  value={menuFormData.description}
                  onChange={(e) => setMenuFormData({...menuFormData, description: e.target.value})}
                  placeholder="Описание пункта меню"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Порядок</label>
                <Input
                  type="number"
                  value={menuFormData.order}
                  onChange={(e) => setMenuFormData({...menuFormData, order: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="menuActiveEdit"
                  checked={menuFormData.isActive}
                  onChange={(e) => setMenuFormData({...menuFormData, isActive: e.target.checked})}
                />
                <label htmlFor="menuActiveEdit" className="text-sm font-medium">Активен</label>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleUpdateMenuItem} disabled={isSubmitting}>
                {isSubmitting ? "Сохранение..." : "Сохранить"}
              </Button>
              <Button variant="outline" onClick={() => setIsMenuDrawerOpen(false)}>
                Отмена
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Диалог подтверждения удаления */}
        <Dialog open={deleteConfirm?.isOpen || false} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Подтверждение удаления
              </DialogTitle>
              <DialogDescription className="text-black">
                Вы уверены, что хотите удалить "{deleteConfirm?.item?.title}"? 
                {deleteConfirm?.type === 'menu' && ' Это действие также удалит все подменю.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setDeleteConfirm(null)}
              >
                Отмена
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Удаление..." : "Удалить"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";

function AdminMenuContent() {
  const [sidebarMenuItems, setSidebarMenuItems] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({ title: '', path: '', order: 0, selectedRoles: [] });
  const [loading, setLoading] = useState(true);

  const getRoleLabel = (roleName: string) => {
    const roleMap: { [key: string]: string } = {
      'PLATFORM_OWNER': 'Владелец платформы',
      'PARTNER': 'Партнер',
      'MANAGER': 'Менеджер',
      'EMPLOYEE': 'Сотрудник'
    };
    return roleMap[roleName] || roleName;
  };

  const fetchSidebarMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/menu-items');
      if (response.ok) {
        const data = await response.json();
        setSidebarMenuItems(data);
      }
    } catch (error) {
      console.error('Error fetching sidebar menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchSidebarMenuItems();
    fetchRoles();
  }, []);

  const updateVisibility = async (id: string, selectedRoles: string[]) => {
    const payload = sidebarMenuItems.find(i=>i.id===id);
    if (!payload) return;
    
    const res = await fetch('/api/admin/menu-items', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        title: payload.title,
        path: payload.path,
        order: payload.order,
        selectedRoles
      })
    });
    
    if (res.ok) {
      setSidebarMenuItems(prev => prev.map(i => i.id===id ? { ...i, roles: selectedRoles } : i));
    }
  };

  const handleSave = async () => {
    const isEdit = Boolean(form.id);
    const res = await fetch('/api/admin/menu-items', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: form.id,
        title: form.title,
        path: form.path,
        order: Number(form.order) || 0,
        selectedRoles: form.selectedRoles || []
      })
    });
    
    if (res.ok) {
      setShowForm(false);
      await fetchSidebarMenuItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот пункт меню?')) {
      const res = await fetch(`/api/admin/menu-items?id=${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        await fetchSidebarMenuItems();
      }
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
                { label: "Управление боковым меню", isCurrent: true },
              ]}
            />
            <h1 className="text-3xl font-bold">Управление боковым меню</h1>
            <p className="text-muted-foreground">Настройка бокового навигационного меню системы</p>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Элементы бокового меню</CardTitle>
                  <CardDescription>
                    Настройка элементов навигации
                  </CardDescription>
                </div>
                <Button onClick={()=>{ setShowForm(true); setForm({ title:'', path:'', order:0, selectedRoles:[] }); }} className="bg-blue-600 hover:bg-blue-700">+ Добавить пункт меню</Button>
              </div>
            </CardHeader>
            <CardContent>
              {showForm && (
                <div className="mb-4 p-4 rounded-xl border bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input className="border rounded-md px-3 py-2" placeholder="Название" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
                    <input className="border rounded-md px-3 py-2" placeholder="/path" value={form.path} onChange={e=>setForm({...form,path:e.target.value})} />
                    <input className="border rounded-md px-3 py-2" type="number" placeholder="Порядок" value={form.order} onChange={e=>setForm({...form,order:Number(e.target.value)})} />
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-2">Кто видит пункт (оставьте пустым — видят все):</div>
                    <div className="flex flex-wrap gap-2">
                      {roles.map(role => {
                        const active = (form.selectedRoles || []).includes(role.role);
                        return (
                          <button
                            key={role.role}
                            type="button"
                            onClick={()=>{
                              const set = new Set(form.selectedRoles || []);
                              if (set.has(role.role)) set.delete(role.role); else set.add(role.role);
                              setForm({...form, selectedRoles: Array.from(set)});
                            }}
                            className={`px-3 py-1 rounded-full text-xs border ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                          >{getRoleLabel(role.role)}</button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button onClick={handleSave}>Сохранить</Button>
                    <Button variant="outline" onClick={()=>setShowForm(false)}>Отмена</Button>
                  </div>
                </div>
              )}
              {loading ? (
                <div className="text-center py-4">Загрузка...</div>
              ) : (
                <div className="mt-4 space-y-2">
                  {sidebarMenuItems.map((item: any) => (
                    <div key={item.id} className="p-3 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                            <p className="text-xs text-gray-500">{item.path}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={item.isActive ? 'success' : 'secondary'} size="sm">
                                {item.isActive ? 'активный' : 'неактивный'}
                              </Badge>
                              <div className="text-xs text-gray-500">
                                Доступ: {item.roles?.length ? item.roles.map((r: string) => getRoleLabel(r)).join(', ') : 'все роли'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={()=>{ setShowForm(true); setForm({ ...item, selectedRoles: item.roles || [] }); }}
                            className="h-7 px-2 text-xs"
                          >
                            Редактировать
                          </Button>
                          <div className="hidden md:flex flex-wrap gap-1 max-w-[280px]">
                            {roles.map(role => {
                              const active = (item.roles || []).includes(role.role);
                              return (
                                <button
                                  key={role.role}
                                  type="button"
                                  onClick={()=>{
                                    const set = new Set((item.roles || []) as string[]);
                                    if (set.has(role.role)) set.delete(role.role); else set.add(role.role);
                                    updateVisibility(item.id, Array.from(set));
                                  }}
                                  className={`px-2 py-1 rounded-full text-[11px] border ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                >{getRoleLabel(role.role)}</button>
                              );
                            })}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="h-7 px-2 text-xs text-red-600 border-red-300 hover:text-white hover:bg-red-600 hover:border-red-600"
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AccessGuard>
  );
}

export default function AdminMenuPage() {
  return (
    <LayoutWrapper>
      <AdminMenuContent />
    </LayoutWrapper>
  );
}

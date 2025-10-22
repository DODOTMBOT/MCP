"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Combobox } from "@/components/ui/combobox";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { User, Calendar, Shield, Filter, ArrowUpDown, ArrowUp, ArrowDown, Check, ChevronDown } from "lucide-react";

// Кастомный Combobox компонент
function CustomCombobox({ 
  options, 
  value, 
  onValueChange, 
  placeholder = "Выберите опцию...", 
  className = "w-48" 
}: {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (open && !target.closest('.custom-combobox')) {
        setOpen(false);
        setSearchValue("");
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative custom-combobox">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-white hover:border-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
      >
        <span className={`text-xs ${selectedOption ? "text-gray-900" : "text-gray-500"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`ml-1 h-3 w-3 shrink-0 opacity-50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      
      {open && (
        <div className="absolute z-50 w-full mt-0.5 bg-white border border-gray-300 rounded shadow-lg">
          <div className="p-1.5">
            <input
              type="text"
              placeholder="Поиск..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-1.5 text-xs text-gray-500">Ничего не найдено</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onValueChange?.(option.value);
                    setOpen(false);
                    setSearchValue("");
                  }}
                  className="w-full flex items-center px-2 py-1.5 text-xs hover:bg-gray-100 text-left whitespace-nowrap"
                >
                  <Check
                    className={`mr-1.5 h-3 w-3 ${
                      value === option.value ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminUsersContent() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [partnerFilter, setPartnerFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Доступные роли с правильными названиями
  const availableRoles = [
    { value: "PLATFORM_OWNER", label: "Владелец платформы", color: "bg-red-100 text-red-800" },
    { value: "PARTNER", label: "Партнер", color: "bg-blue-100 text-blue-800" },
    { value: "MANAGER", label: "Менеджер", color: "bg-purple-100 text-purple-800" },
    { value: "EMPLOYEE", label: "Сотрудник", color: "bg-green-100 text-green-800" }
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      } else {
        setError("Ошибка загрузки пользователей");
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Фильтрация и сортировка
  useEffect(() => {
    let filtered = [...allUsers];

    // Фильтр по партнеру
    if (partnerFilter !== "all") {
      filtered = filtered.filter(user => {
        if (partnerFilter === "no-partner") {
          return !user.partner;
        }
        return user.partner && user.partner.id === partnerFilter;
      });
    }

    // Фильтр по роли
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Сортировка
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortField) {
          case "name":
            aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
            bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
            break;
          case "email":
            aValue = a.email.toLowerCase();
            bValue = b.email.toLowerCase();
            break;
          case "partner":
            aValue = a.partner ? `${a.partner.firstName} ${a.partner.lastName}`.toLowerCase() : "";
            bValue = b.partner ? `${b.partner.firstName} ${b.partner.lastName}`.toLowerCase() : "";
            break;
          case "role":
            aValue = a.role.toLowerCase();
            bValue = b.role.toLowerCase();
            break;
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(filtered);
  }, [allUsers, partnerFilter, roleFilter, sortField, sortDirection]);

  const updateRole = async (userId: string, newRole: string) => {
    try {
      setUpdating(userId);
      setError("");
      
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      
      if (res.ok) {
        const updated = await res.json();
        setAllUsers(prev => prev.map(u => u.id === updated.id ? { ...u, role: updated.role } : u));
        
        // Роль изменена успешно - сайдбар обновится автоматически
        console.log(`Роль изменена на "${newRole}"`);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Ошибка обновления роли");
      }
    } catch (e) {
      console.error('Failed to update role', e);
      setError("Ошибка обновления роли");
    } finally {
      setUpdating(null);
    }
  };

  const getRoleInfo = (role: string) => {
    return availableRoles.find(r => r.value === role) || { 
      value: role, 
      label: role, 
      color: "bg-gray-100 text-gray-800" 
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="w-4 h-4 text-blue-600" /> : 
      <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  // Получаем уникальных партнеров для фильтра
  const getUniquePartners = () => {
    const partners = allUsers
      .filter(user => user.partner)
      .map(user => user.partner)
      .filter((partner, index, self) => 
        index === self.findIndex(p => p.id === partner.id)
      );
    return partners;
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
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg border shadow-sm p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Пользователи системы</h2>
              <p className="text-sm text-gray-600">Список и управление пользователями ({filteredUsers.length} из {allUsers.length} пользователей)</p>
            </div>

            {/* Фильтры */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Фильтры:</span>
                </div>
                
                {/* Фильтр по партнеру */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Партнер:</label>
                  <CustomCombobox
                    options={[
                      { value: "all", label: "Все партнеры" },
                      { value: "no-partner", label: "Без партнера" },
                      ...getUniquePartners().map((partner) => ({
                        value: partner.id,
                        label: `${partner.firstName} ${partner.lastName}`
                      }))
                    ]}
                    value={partnerFilter}
                    onValueChange={setPartnerFilter}
                    placeholder="Выберите партнера"
                    className="min-w-[140px]"
                  />
                </div>

                {/* Фильтр по роли */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Роль:</label>
                  <CustomCombobox
                    options={[
                      { value: "all", label: "Все роли" },
                      ...availableRoles.map((role) => ({
                        value: role.value,
                        label: role.label
                      }))
                    ]}
                    value={roleFilter}
                    onValueChange={setRoleFilter}
                    placeholder="Выберите роль"
                    className="min-w-[180px]"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Загрузка пользователей...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button 
                        onClick={() => handleSort("name")}
                        className="flex items-center space-x-1 hover:text-blue-600"
                      >
                        <span>Пользователь</span>
                        {getSortIcon("name")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        onClick={() => handleSort("email")}
                        className="flex items-center space-x-1 hover:text-blue-600"
                      >
                        <span>Email</span>
                        {getSortIcon("email")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        onClick={() => handleSort("partner")}
                        className="flex items-center space-x-1 hover:text-blue-600"
                      >
                        <span>Партнер</span>
                        {getSortIcon("partner")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        onClick={() => handleSort("role")}
                        className="flex items-center space-x-1 hover:text-blue-600"
                      >
                        <span>Роль</span>
                        {getSortIcon("role")}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center space-x-1 hover:text-blue-600"
                      >
                        <span>Дата регистрации</span>
                        {getSortIcon("createdAt")}
                      </button>
                    </TableHead>
                    <TableHead className="w-[200px]">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any) => {
                    const roleInfo = getRoleInfo(user.role);
                    return (
                      <TableRow key={user.id}>
                        {/* Пользователь */}
                        <TableCell>
                          <button 
                            onClick={() => window.location.href = `/admin/users/${user.id}`}
                            className="font-medium text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left truncate max-w-[200px]"
                            title={`${user.firstName} ${user.lastName}`}
                          >
                            {user.firstName} {user.lastName}
                          </button>
                        </TableCell>
                        
                        {/* Email */}
                        <TableCell>
                          <span className="text-sm truncate max-w-[200px] block" title={user.email}>
                            {user.email}
                          </span>
                        </TableCell>
                        
                        {/* Партнер */}
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {user.partner ? (
                              <span className="text-blue-600">
                                {user.partner.firstName} {user.partner.lastName}
                              </span>
                            ) : (
                              <span className="text-gray-500">Не назначен</span>
                            )}
                          </div>
                        </TableCell>
                        
                        {/* Роль */}
                        <TableCell>
                          <Badge className={`text-xs ${roleInfo.color}`}>
                            {roleInfo.label}
                          </Badge>
                        </TableCell>
                        
                        {/* Дата регистрации */}
                        <TableCell>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        
                        {/* Действия */}
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <CustomCombobox
                              options={availableRoles}
                              value={user.role}
                              onValueChange={(value) => updateRole(user.id, value)}
                              placeholder="Выберите роль"
                              className="min-w-[160px]"
                            />
                            
                            {updating === user.id && (
                              <div className="w-4 h-4">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
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

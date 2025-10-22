"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [partnerCode, setPartnerCode] = useState<string>("");
  const [alert, setAlert] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push('/login');
      return;
    }
    fetchUserProfile();
  }, [session, status, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setPartnerCode(userData.partnerCode || "");
      } else {
        console.error('Failed to fetch profile:', response.status, response.statusText);
        // Fallback to session data
        setUser(session.user);
        setFirstName(session.user?.name?.split(' ')[0] || "");
        setLastName(session.user?.name?.split(' ').slice(1).join(' ') || "");
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to session data
      setUser(session.user);
      setFirstName(session.user?.name?.split(' ')[0] || "");
      setLastName(session.user?.name?.split(' ').slice(1).join(' ') || "");
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setIsEditing(false);
  };

  const generateCode = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return result;
  };

  const handleRegeneratePartnerCode = async () => {
    const newCode = generateCode();
    try {
      const res = await fetch('/api/profile/partner-code', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerCode: newCode })
      });
      if (res.ok) {
        setPartnerCode(newCode);
        setAlert(`Новый код партнера: ${newCode}`);
        setTimeout(() => setAlert(""), 4000);
      }
    } catch (e) {
      setAlert('Не удалось обновить код');
      setTimeout(() => setAlert(""), 4000);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  const getRoleDisplayName = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'OWNER': return 'Владелец';
      case 'ADMIN': return 'Администратор';
      case 'MANAGER': return 'Менеджер';
      case 'PARTNER': return 'Партнер';
      case 'EMPLOYEE': return 'Сотрудник';
      default: return role || 'Сотрудник';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'OWNER': return 'bg-purple-100 text-purple-800';
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-blue-100 text-blue-800';
      case 'PARTNER': return 'bg-green-100 text-green-800';
      case 'EMPLOYEE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    }
    return "Пользователь";
  };

  const getInitials = () => {
    const first = user.firstName ? user.firstName.charAt(0).toUpperCase() : "";
    const last = user.lastName ? user.lastName.charAt(0).toUpperCase() : "";
    return first + last || "П";
  };

  const isRoleBelowPartner = (role: string) => {
    return role?.toUpperCase() === 'ADMIN' || role?.toUpperCase() === 'EMPLOYEE';
  };

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Профиль пользователя</h1>
            <p className="text-gray-600">Управление личными данными и настройками</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 font-semibold text-xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="text-2xl font-semibold text-gray-900">{getDisplayName()}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {user.email}
                  </div>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Редактировать
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {alert && (
                <div className="p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">{alert}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Имя */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Имя
                  </Label>
                  {isEditing ? (
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Введите имя"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-gray-900">{user.firstName || "Не указано"}</span>
                    </div>
                  )}
                </div>

                {/* Фамилия */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Фамилия
                  </Label>
                  {isEditing ? (
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Введите фамилию"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-gray-900">{user.lastName || "Не указано"}</span>
                    </div>
                  )}
                </div>

                {/* Email (заблокирован) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Email
                  </Label>
                  <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Роль в системе (заблокирована) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 100-2 1 1 0 000 2zm.464 2.95a1 1 0 00-1.414 0 1 1 0 000 1.414 1 1 0 001.414 0z" clipRule="evenodd" />
                    </svg>
                    Роль в системе
                  </Label>
                  <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getRoleColor(user.role)} flex items-center gap-1`}>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 100-2 1 1 0 000 2zm.464 2.95a1 1 0 00-1.414 0 1 1 0 000 1.414 1 1 0 001.414 0z" clipRule="evenodd" />
                        </svg>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Код партнера (только PARTNER) */}
                {user.role?.toUpperCase() === 'PARTNER' && (
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 5a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zM12 5a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2V5z"/>
                      </svg>
                      Код партнера
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex-1">
                        <span className="text-gray-900 tracking-widest">{partnerCode || '—'}</span>
                      </div>
                      <Button onClick={handleRegeneratePartnerCode} variant="outline">Обновить</Button>
                    </div>
                  </div>
                )}

                {/* Дата регистрации */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Дата регистрации
                  </Label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-900">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : "Не указано"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Партнер (только для ролей ниже партнера) */}
                {isRoleBelowPartner(user.role) && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" clipRule="evenodd" />
                      </svg>
                      Партнер
                    </Label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-900">
                          {user.partner ? `${user.partner.firstName || ''} ${user.partner.lastName || ''}`.trim() || user.partner.email : "Не назначен"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Кнопки редактирования */}
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={handleSave} 
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                  <Button 
                    onClick={handleCancel} 
                    variant="outline"
                    disabled={isLoading}
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Отмена
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
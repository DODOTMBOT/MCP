"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  partnerCode?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/users/${userId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch user");
          }
          const data: UserProfile = await response.json();
          setUser(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Link href="/admin/users">
          <Button variant="outline" className="mb-4">
            ← Назад к списку
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Ошибка</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <Link href="/admin/users">
          <Button variant="outline" className="mb-4">
            ← Назад к списку
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Ошибка</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Пользователь не найден</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link href="/admin/users">
        <Button variant="outline" className="mb-4">
          ← Назад к списку
        </Button>
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Профиль пользователя</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Информация о пользователе</h3>
              <p>
                <span className="font-medium">Имя:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Роль:</span>{" "}
                {user.role === "PARTNER" ? "Партнер" : user.role}
              </p>
              {user.partnerCode && (
                <p>
                  <span className="font-medium">Код партнера:</span> {user.partnerCode}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Системная информация</h3>
              <p>
                <span className="font-medium">ID пользователя:</span> {user.id}
              </p>
              <p>
                <span className="font-medium">Дата создания:</span>{" "}
                {format(new Date(user.createdAt), "dd.MM.yyyy", { locale: ru })}
              </p>
              <p>
                <span className="font-medium">Последнее обновление:</span>{" "}
                {format(new Date(user.updatedAt), "dd.MM.yyyy", { locale: ru })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
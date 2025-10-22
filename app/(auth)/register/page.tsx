"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState<"partner" | "employee">("partner");
  const [partnerCode, setPartnerCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Валидация
    if (!firstName.trim() || !lastName.trim()) {
      setError("Имя и фамилия обязательны");
      setLoading(false);
      return;
    }

    if (userType === "employee" && !partnerCode.trim()) {
      setError("Код партнера обязателен для сотрудников");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email, 
        password, 
        firstName: firstName.trim(), 
        lastName: lastName.trim(),
        userType,
        partnerCode: userType === "employee" ? partnerCode.trim() : undefined
      }),
    });
    setLoading(false);
    
    if (res.ok) {
      router.replace("/login");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Ошибка регистрации");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Логотип и название бренда */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">U</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span style={{ color: '#FFFFFF' }}>Unit</span>
            <span style={{ color: '#F9B42D' }}>One</span>
          </h1>
          <p className="text-gray-600">Система управления операционными процессами</p>
        </div>

        {/* Форма регистрации */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Регистрация</h2>
            <p className="text-gray-600">Создайте аккаунт для доступа к Check-Point</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  Имя *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Фамилия *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите вашу фамилию"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите ваш email"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Пароль *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите ваш пароль"
                  required
                />
              </div>

              {/* Выбор типа пользователя */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Кем вы хотите стать? *
                </Label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userType"
                      value="partner"
                      checked={userType === "partner"}
                      onChange={(e) => setUserType(e.target.value as "partner" | "employee")}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Партнер (владелец заведения)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userType"
                      value="employee"
                      checked={userType === "employee"}
                      onChange={(e) => setUserType(e.target.value as "partner" | "employee")}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Сотрудник</span>
                  </label>
                </div>
              </div>

              {/* Код партнера (только для сотрудников) */}
              {userType === "employee" && (
                <div>
                  <Label htmlFor="partnerCode" className="text-sm font-medium text-gray-700">
                    Код партнера *
                  </Label>
                  <Input
                    id="partnerCode"
                    type="text"
                    value={partnerCode}
                    onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите код партнера (например: ABC12)"
                    required
                    maxLength={5}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Получите код у вашего партнера
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>

          {/* Кнопка входа */}
          <div className="mt-6">
            <Link href="/login" className="block">
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
              >
                Войти
              </Button>
            </Link>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Система управления операционными процессами HoReCa
          </p>
        </div>
      </div>
    </div>
  );
}

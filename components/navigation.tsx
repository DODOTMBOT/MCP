"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarSeparator, 
  MenubarTrigger 
} from "@/components/ui/menubar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface MenuItem {
  id: string;
  title: string;
  path: string | null;
  description: string | null;
  isActive: boolean;
  order: number;
  children: MenuItem[];
}

export default function Navigation() {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // Force re-render key

  const handleCheck = () => {
    alert("Проверка выполнена! Система работает корректно.");
  };

  // Загрузка меню из базы данных
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        // Сначала пробуем получить данные из API профиля
        const profileResponse = await fetch('/api/profile');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('Profile data:', profileData);
          const normalized = (profileData && profileData.user) ? profileData.user : profileData;
          setUser(normalized);
          setUserLoaded(true);
          setRenderKey(prev => prev + 1); // Force re-render
        } else {
          console.log('Profile API failed, falling back to session');
          // Fallback к сессии
          const sessionResponse = await fetch('/api/auth/session');
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            console.log('Session data:', sessionData);
            const normalized = (sessionData && sessionData.user) ? sessionData.user : sessionData;
            setUser(normalized);
            setUserLoaded(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        // Fallback к сессии при ошибке
        try {
          const sessionResponse = await fetch('/api/auth/session');
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            console.log('Session fallback data:', sessionData);
            const normalized = (sessionData && sessionData.user) ? sessionData.user : sessionData;
            setUser(normalized);
            setUserLoaded(true);
          }
        } catch (sessionError) {
          console.error('Error fetching session:', sessionError);
        }
      }
    };

    fetchMenuItems();
    fetchUser();
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏢</span>
              <span className="text-xl font-bold text-gray-900">Check-Point</span>
            </Link>
            
            <Menubar className="hidden md:flex">
              {loading ? (
                <div className="text-sm text-muted-foreground">Загрузка меню...</div>
              ) : (
                menuItems
                  .filter(item => item.isActive)
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <MenubarMenu key={item.id}>
                      <MenubarTrigger className="flex items-center space-x-1">
                        <span className="text-sm">{item.title}</span>
                      </MenubarTrigger>
                      <MenubarContent>
                        {item.children && item.children.length > 0 ? (
                          item.children
                            .filter(child => child.isActive)
                            .sort((a, b) => a.order - b.order)
                            .map((child) => (
                              <MenubarItem key={child.id}>
                                {child.path ? (
                                  <Link href={child.path} className="block w-full">
                                    <div>
                                      <div className="font-medium">{child.title}</div>
                                      {child.description && (
                                        <div className="text-xs text-muted-foreground">{child.description}</div>
                                      )}
                                    </div>
                                  </Link>
                                ) : (
                                  <div>
                                    <div className="font-medium">{child.title}</div>
                                    {child.description && (
                                      <div className="text-xs text-muted-foreground">{child.description}</div>
                                    )}
                                  </div>
                                )}
                              </MenubarItem>
                            ))
                        ) : (
                          <MenubarItem>
                            <div className="text-sm text-muted-foreground">Нет подменю</div>
                          </MenubarItem>
                        )}
                      </MenubarContent>
                    </MenubarMenu>
                  ))
              )}
            </Menubar>
          </div>
          
          <div className="flex items-center space-x-4">
            {pathname !== "/admin" && user?.role === "OWNER" && (
              <Link href="/admin">
                <Button 
                  variant="secondary" 
                  size="sm"
                >
                  🔧 Админка
                </Button>
              </Link>
            )}
            {pathname === "/admin" && null}
            
                {/* Avatar профиля */}
                <Link href="/profile" className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors group">
                  <Avatar key={renderKey} className="h-8 w-8 ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-200">
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 font-semibold">
                      {(() => {
                        if (user?.firstName && user?.lastName) {
                          return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
                        } else if (user?.firstName) {
                          return user.firstName.charAt(0).toUpperCase();
                        } else if (user?.lastName) {
                          return user.lastName.charAt(0).toUpperCase();
                        } else if (user?.name) {
                          return user.name.charAt(0).toUpperCase();
                        }
                        return "П";
                      })()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {userLoaded ? (() => {
                        const emailName = user?.email ? String(user.email).split('@')[0] : undefined;
                        const displayName = user?.lastName && user?.firstName
                          ? `${user.lastName} ${user.firstName}`
                          : user?.lastName || user?.firstName || user?.name || emailName || "Пользователь";
                        return displayName;
                      })() : "Загрузка..."}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">
                      {(() => {
                        const r = (user?.role || "").toString().toLowerCase();
                        if (r === 'owner') return 'Владелец';
                        if (r === 'partner') return 'Партнер';
                        if (r === 'point') return 'Заведение';
                        if (r === 'employee') return 'Сотрудник';
                        return user?.role || 'Роль';
                      })()}
                    </div>
                  </div>
                </Link>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Выход
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Главная страница модуля Marketplace
 * 
 * Feature-based архитектура с перенаправлением на список товаров
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ShoppingCart, Package, TrendingUp } from "lucide-react";

function MarketplaceContent() {
  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Маркетплейс", isCurrent: true }
        ]} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Товары
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Управление каталогом товаров</p>
            <Link href="/modules/marketplace/list">
              <Button className="w-full">Перейти к товарам</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Категории
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Управление категориями товаров</p>
            <Link href="/modules/marketplace/categories">
              <Button className="w-full">Перейти к категориям</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Аналитика
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Статистика и отчеты</p>
            <Link href="/modules/marketplace/analytics">
              <Button className="w-full">Перейти к аналитике</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <AccessGuard 
      allowedRoles={["ADMIN", "PARTNER", "EMPLOYEE"]} 
      fallback={<div>Нет доступа к маркетплейсу</div>}
    >
      <LayoutWrapper>
        <MarketplaceContent />
      </LayoutWrapper>
    </AccessGuard>
  );
}
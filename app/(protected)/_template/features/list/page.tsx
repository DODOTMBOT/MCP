/**
 * Страница списка элементов
 * 
 * Feature: list - отображение списка элементов с фильтрацией и поиском
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

function TemplateListContent() {
  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Название модуля", href: "/modules/template" },
          { label: "Список", isCurrent: true }
        ]} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Список элементов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input placeholder="Поиск..." className="flex-1" />
            <Button>Фильтры</Button>
            <Link href="/modules/template/create">
              <Button>Создать</Button>
            </Link>
          </div>
          
          <div className="space-y-2">
            {/* Здесь будет список элементов */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Элемент 1</h3>
              <p className="text-sm text-gray-600">Описание элемента</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TemplateListPage() {
  return (
    <AccessGuard 
      allowedRoles={["ADMIN", "PARTNER", "EMPLOYEE"]} 
      fallback={<div>Нет доступа к списку</div>}
    >
      <LayoutWrapper>
        <TemplateListContent />
      </LayoutWrapper>
    </AccessGuard>
  );
}

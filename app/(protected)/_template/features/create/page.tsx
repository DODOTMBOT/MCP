/**
 * Страница создания элемента
 * 
 * Feature: create - форма создания нового элемента
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

function TemplateCreateContent() {
  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Название модуля", href: "/modules/template" },
          { label: "Создание", isCurrent: true }
        ]} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Создать элемент</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название</label>
              <Input placeholder="Введите название" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <Textarea placeholder="Введите описание" />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">Создать</Button>
              <Link href="/modules/template">
                <Button variant="outline">Отмена</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TemplateCreatePage() {
  return (
    <AccessGuard 
      allowedRoles={["ADMIN", "PARTNER", "EMPLOYEE"]} 
      fallback={<div>Нет доступа к созданию</div>}
    >
      <LayoutWrapper>
        <TemplateCreateContent />
      </LayoutWrapper>
    </AccessGuard>
  );
}

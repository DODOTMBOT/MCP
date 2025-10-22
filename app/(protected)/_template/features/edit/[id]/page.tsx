/**
 * Страница редактирования элемента
 * 
 * Feature: edit - форма редактирования существующего элемента
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

interface TemplateEditPageProps {
  params: {
    id: string;
  };
}

function TemplateEditContent({ id }: { id: string }) {
  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Название модуля", href: "/modules/template" },
          { label: "Редактирование", isCurrent: true }
        ]} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Редактировать элемент #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название</label>
              <Input placeholder="Введите название" defaultValue="Текущее название" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <Textarea placeholder="Введите описание" defaultValue="Текущее описание" />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">Сохранить</Button>
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

export default function TemplateEditPage({ params }: TemplateEditPageProps) {
  return (
    <AccessGuard 
      allowedRoles={["ADMIN", "PARTNER", "EMPLOYEE"]} 
      fallback={<div>Нет доступа к редактированию</div>}
    >
      <LayoutWrapper>
        <TemplateEditContent id={params.id} />
      </LayoutWrapper>
    </AccessGuard>
  );
}

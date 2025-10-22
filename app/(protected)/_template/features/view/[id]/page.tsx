/**
 * Страница просмотра элемента
 * 
 * Feature: view - детальный просмотр элемента
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

interface TemplateViewPageProps {
  params: {
    id: string;
  };
}

function TemplateViewContent({ id }: { id: string }) {
  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Название модуля", href: "/modules/template" },
          { label: "Просмотр", isCurrent: true }
        ]} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Элемент #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <p className="text-lg">Название элемента</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Описание</label>
              <p>Описание элемента</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Дата создания</label>
              <p className="text-sm text-gray-600">22.10.2024</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Link href={`/modules/template/edit/${id}`}>
              <Button>Редактировать</Button>
            </Link>
            <Link href="/modules/template">
              <Button variant="outline">Назад к списку</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TemplateViewPage({ params }: TemplateViewPageProps) {
  return (
    <AccessGuard 
      allowedRoles={["ADMIN", "PARTNER", "EMPLOYEE"]} 
      fallback={<div>Нет доступа к просмотру</div>}
    >
      <LayoutWrapper>
        <TemplateViewContent id={params.id} />
      </LayoutWrapper>
    </AccessGuard>
  );
}

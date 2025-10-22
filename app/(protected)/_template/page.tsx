/**
 * Главная страница модуля
 * 
 * Feature-based архитектура:
 * - features/ - страницы функций
 * - components/ - переиспользуемые компоненты
 * - lib/ - бизнес-логика и утилиты
 * - api/ - API endpoints
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Link from "next/link";

function TemplateModuleContent() {
  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Название модуля", isCurrent: true }
        ]} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Название модуля</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Описание функциональности модуля</p>
          <div className="mt-4 flex gap-2">
            <Link href="/modules/template/list">
              <Button>Список элементов</Button>
            </Link>
            <Link href="/modules/template/create">
              <Button variant="outline">Создать элемент</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TemplateModulePage() {
  return (
    <AccessGuard 
      allowedRoles={["ADMIN", "PARTNER", "EMPLOYEE"]} 
      fallback={<div>Нет доступа к модулю</div>}
    >
      <LayoutWrapper>
        <TemplateModuleContent />
      </LayoutWrapper>
    </AccessGuard>
  );
}
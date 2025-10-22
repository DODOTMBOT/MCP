import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import { Breadcrumb } from "@/components/ui/breadcrumb";

/**
 * Шаблон модуля
 * 
 * Принципы:
 * - UI компоненты в components/ui/
 * - Бизнес-логика в lib/
 * - Проверка доступа через AccessGuard
 * - Использование alias-путей
 */

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
          <div className="mt-4">
            <Button>Действие</Button>
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

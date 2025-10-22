/**
 * UI компонент - карточка элемента
 * 
 * Переиспользуемый компонент для отображения элемента в списке
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface TemplateCardProps {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TemplateCard({ 
  id, 
  name, 
  description, 
  createdAt, 
  onEdit, 
  onDelete 
}: TemplateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <Link href={`/modules/template/view/${id}`} className="hover:underline">
            {name}
          </Link>
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(id)}
              >
                Редактировать
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDelete(id)}
              >
                Удалить
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-gray-600 mb-2">{description}</p>
        )}
        <p className="text-xs text-gray-500">
          Создано: {createdAt.toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}

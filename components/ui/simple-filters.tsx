"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';

interface Filter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SimpleFiltersProps {
  onFiltersChange: (filters: Filter[]) => void;
}

export function SimpleFilters({ onFiltersChange }: SimpleFiltersProps) {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [newFilter, setNewFilter] = useState({
    field: 'title',
    operator: 'contains',
    value: ''
  });

  const addFilter = () => {
    if (newFilter.value.trim()) {
      const filter: Filter = {
        id: Date.now().toString(),
        field: newFilter.field,
        operator: newFilter.operator,
        value: newFilter.value.trim()
      };
      const updatedFilters = [...filters, filter];
      setFilters(updatedFilters);
      onFiltersChange(updatedFilters);
      setNewFilter({ field: 'title', operator: 'contains', value: '' });
    }
  };

  const removeFilter = (id: string) => {
    const updatedFilters = filters.filter(f => f.id !== id);
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearAllFilters = () => {
    setFilters([]);
    onFiltersChange([]);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        <span className="font-medium">Фильтры</span>
        {filters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Очистить все
          </Button>
        )}
      </div>

      {/* Добавление нового фильтра */}
      <div className="flex items-center gap-2">
        <select
          value={newFilter.field}
          onChange={(e) => setNewFilter({...newFilter, field: e.target.value})}
          className="px-3 py-1 border rounded text-sm"
        >
          <option value="title">Название</option>
          <option value="path">Путь</option>
          <option value="isActive">Статус</option>
        </select>

        <select
          value={newFilter.operator}
          onChange={(e) => setNewFilter({...newFilter, operator: e.target.value})}
          className="px-3 py-1 border rounded text-sm"
        >
          <option value="contains">содержит</option>
          <option value="startsWith">начинается с</option>
          <option value="endsWith">заканчивается на</option>
          <option value="isExactly">равно</option>
        </select>

        <Input
          value={newFilter.value}
          onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
          placeholder="Введите значение..."
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && addFilter()}
        />

        <Button onClick={addFilter} size="sm">
          Добавить
        </Button>
      </div>

      {/* Отображение активных фильтров */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge key={filter.id} variant="secondary" className="flex items-center gap-1">
              <span className="text-xs">
                {filter.field === 'title' ? 'Название' : 
                 filter.field === 'path' ? 'Путь' : 'Статус'} 
                {filter.operator === 'contains' ? ' содержит' :
                 filter.operator === 'startsWith' ? ' начинается с' :
                 filter.operator === 'endsWith' ? ' заканчивается на' : ' равно'} 
                "{filter.value}"
              </span>
              <button
                onClick={() => removeFilter(filter.id)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

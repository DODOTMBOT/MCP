/**
 * Страница списка товаров
 * 
 * Feature: list - отображение списка товаров с фильтрацией и поиском
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AccessGuard from "@/components/access-guard";
import LayoutWrapper from "@/components/layout-wrapper";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Search, Filter, ShoppingCart, Star, MapPin } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  rating?: number;
  location?: string;
  inStock: boolean;
}

function MarketplaceListContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products-simple");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const applyFilters = (products: Product[]) => {
    return products.filter((product) => {
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  };

  const filteredProducts = applyFilters(products);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Загрузка товаров...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: "Главная", href: "/dashboard" },
          { label: "Маркетплейс", href: "/modules/marketplace" },
          { label: "Список товаров", isCurrent: true }
        ]} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Список товаров</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Фильтры */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Поиск товаров..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                onClick={() => setSelectedCategory("")}
              >
                Все категории
              </Button>
              <Button
                variant={selectedCategory === "Еда" ? "default" : "outline"}
                onClick={() => setSelectedCategory("Еда")}
              >
                Еда
              </Button>
              <Button
                variant={selectedCategory === "Напитки" ? "default" : "outline"}
                onClick={() => setSelectedCategory("Напитки")}
              >
                Напитки
              </Button>
              <Button
                variant={selectedCategory === "Десерты" ? "default" : "outline"}
                onClick={() => setSelectedCategory("Десерты")}
              >
                Десерты
              </Button>
            </div>
          </div>

          {/* Сетка товаров */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ShoppingCart className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{product.category}</Badge>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    )}
                  </div>

                  {product.location && (
                    <div className="flex items-center gap-1 mb-3 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{product.location}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">
                      {product.price.toLocaleString()} ₽
                    </div>
                    <Button 
                      disabled={!product.inStock}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {product.inStock ? "В корзину" : "Нет в наличии"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Товары не найдены</h3>
              <p className="text-gray-600">
                Попробуйте изменить параметры поиска или фильтры
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MarketplaceListPage() {
  return (
    <AccessGuard 
      allowedRoles={["ADMIN", "PARTNER", "EMPLOYEE"]} 
      fallback={<div>Нет доступа к списку товаров</div>}
    >
      <LayoutWrapper>
        <MarketplaceListContent />
      </LayoutWrapper>
    </AccessGuard>
  );
}

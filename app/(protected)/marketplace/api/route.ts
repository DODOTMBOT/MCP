/**
 * API endpoint для модуля Marketplace
 * 
 * REST API для работы с товарами
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const inStock = searchParams.get("inStock");
    const exportData = searchParams.get("export");

    // Здесь должна быть логика получения товаров из БД
    // const products = await prisma.product.findMany({
    //   where: {
    //     ...(search && { name: { contains: search } }),
    //     ...(category && { category }),
    //     ...(priceMin && { price: { gte: parseFloat(priceMin) } }),
    //     ...(priceMax && { price: { lte: parseFloat(priceMax) } }),
    //     ...(inStock !== null && { inStock: inStock === 'true' }),
    //   },
    //   orderBy: { createdAt: 'desc' }
    // });

    // Заглушка для демонстрации
    const products = [
      {
        id: "1",
        name: "Пример товара",
        description: "Описание товара",
        price: 1000,
        category: "Еда",
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.id
      }
    ];

    if (exportData) {
      // Логика экспорта данных
      const csvContent = products.map(product => 
        `${product.id},"${product.name}","${product.description}","${product.price}","${product.category}","${product.inStock}","${product.createdAt.toISOString()}"`
      ).join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="products-export.csv"'
        }
      });
    }

    return NextResponse.json({
      products,
      total: products.length,
      page: 1,
      limit: 10
    });
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, category, image, location, inStock } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Название обязательно" }, { status: 400 });
    }

    if (!description || description.trim().length === 0) {
      return NextResponse.json({ error: "Описание обязательно" }, { status: 400 });
    }

    if (!price || price <= 0) {
      return NextResponse.json({ error: "Цена должна быть больше 0" }, { status: 400 });
    }

    if (!category || category.trim().length === 0) {
      return NextResponse.json({ error: "Категория обязательна" }, { status: 400 });
    }

    // Здесь должна быть логика создания в БД
    // const product = await prisma.product.create({
    //   data: {
    //     name: name.trim(),
    //     description: description.trim(),
    //     price: parseFloat(price),
    //     category: category.trim(),
    //     image: image?.trim(),
    //     location: location?.trim(),
    //     inStock: Boolean(inStock),
    //     createdBy: session.user.id
    //   }
    // });

    // Заглушка для демонстрации
    const product = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      image: image?.trim(),
      location: location?.trim(),
      inStock: Boolean(inStock),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.id
    };

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании товара:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

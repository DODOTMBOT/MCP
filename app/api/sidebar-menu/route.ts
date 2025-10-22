import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - получить все пункты бокового меню
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'EMPLOYEE';
    
    const menuItems = await prisma.menuItem.findMany({
      where: {
        type: 'sidebar',
        isActive: true,
        accesses: {
          some: {
            canAccess: true,
            role: { name: role }
          }
        }
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    // Гарантируем наличие массива visibleForRoles в ответе
    const normalized = menuItems.map((m: any) => ({
      ...m,
      visibleForRoles: Array.isArray((m as any).visibleForRoles) ? (m as any).visibleForRoles : [],
      children: (m as any).children?.map((c: any) => ({
        ...c,
        visibleForRoles: Array.isArray((c as any).visibleForRoles) ? (c as any).visibleForRoles : [],
      })) ?? [],
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Error fetching sidebar menu items:', error);
    return NextResponse.json({ error: 'Failed to fetch sidebar menu items' }, { status: 500 });
  }
}

// POST - создать новый пункт бокового меню
export async function POST(request: NextRequest) {
  try {
    const { title, path, icon, order, parentId, visibleForRoles } = await request.json();
    const roles = Array.isArray(visibleForRoles) ? visibleForRoles.map((r: string)=>r.toLowerCase()) : [];

    // Защита от дубликатов по path в sidebar: если есть — обновим
    let existing: any = null;
    if (path) {
      existing = await prisma.menuItem.findFirst({ where: { type: 'sidebar', path } });
    }

    const menuItem = existing
      ? await prisma.menuItem.update({
          where: { id: existing.id },
          data: {
            title,
            icon,
            order: order || existing.order || 0,
            isActive: true,
            parentId: parentId || existing.parentId || null,
            visibleForRoles: { set: roles }
          }
        })
      : await prisma.menuItem.create({
          data: {
            title,
            path,
            icon,
            order: order || 0,
            type: 'sidebar',
            isActive: true,
            parentId: parentId || null,
            visibleForRoles: { set: roles }
          }
        });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error('Error creating sidebar menu item:', error);
    return NextResponse.json({ error: 'Failed to create sidebar menu item' }, { status: 500 });
  }
}

// PUT - обновить пункт бокового меню
export async function PUT(request: NextRequest) {
  try {
    const { id, title, path, icon, order, isActive, visibleForRoles } = await request.json();
    const roles = Array.isArray(visibleForRoles) ? visibleForRoles.map((r: string)=>r.toLowerCase()) : undefined;

    // Если есть дубликаты по path, обновим все соответствующие записи одного пути (чтобы UI вёл себя ожидаемо)
    if (path) {
      await prisma.menuItem.updateMany({
        where: { type: 'sidebar', path },
        data: {
          title,
          icon,
          order,
          isActive,
          visibleForRoles: roles !== undefined ? roles : undefined as any
        }
      });
    }
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        title,
        path,
        icon,
        order,
        isActive,
        visibleForRoles: roles !== undefined ? { set: roles } : undefined
      }
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error updating sidebar menu item:', error);
    return NextResponse.json({ error: 'Failed to update sidebar menu item' }, { status: 500 });
  }
}

// DELETE - удалить пункт бокового меню
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.menuItem.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sidebar menu item:', error);
    return NextResponse.json({ error: 'Failed to delete sidebar menu item' }, { status: 500 });
  }
}

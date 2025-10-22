import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const path = "/" + slug.join("/");

  // Исключаем все системные маршруты
  const systemRoutes = [
    "/", "/dashboard", "/admin", "/partner", "/profile", 
    "/login", "/register", "/api", "/_next", "/favicon.ico"
  ];
  
  // Исключаем маршруты, которые начинаются с системных префиксов
  const systemPrefixes = ["/admin/", "/partner/", "/profile/", "/api/", "/_next/"];
  
  if (systemRoutes.includes(path) || systemPrefixes.some(prefix => path.startsWith(prefix))) {
    notFound();
  }

  try {
    const page = await prisma.page.findUnique({
      where: { 
        path,
        isActive: true 
      }
    });

    if (!page) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Верхнее меню */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <span className="text-2xl">🏢</span>
                  <span className="text-xl font-bold text-gray-900">Check-Point</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Основной контент */}
        <div className="container mx-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{page.title}</h1>
              {page.description && (
                <p className="text-muted-foreground">{page.description}</p>
              )}
            </div>
            
            <div className="prose max-w-none">
              {page.content ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: page.content }}
                  className="text-gray-700 leading-relaxed"
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄</div>
                  <h2 className="text-2xl font-semibold mb-2">Страница создана</h2>
                  <p className="text-muted-foreground mb-4">
                    Контент для этой страницы еще не добавлен.
                  </p>
                  <p className="text-sm text-gray-500">
                    Обратитесь к администратору для добавления контента.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching page:", error);
    notFound();
  }
}

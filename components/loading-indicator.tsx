"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export default function LoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Показываем индикатор при смене маршрута
    setIsLoading(true);
    setProgress(0);

    // Симулируем прогресс загрузки
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 50);

    // Завершаем загрузку
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 300);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <Progress 
        value={progress} 
        className="h-1 w-full bg-transparent"
      />
    </div>
  );
}

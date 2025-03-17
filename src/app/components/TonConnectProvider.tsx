'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface TonConnectProviderProps {
  children: ReactNode;
}

export default function TonConnectProvider({ children }: TonConnectProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Отслеживаем изменение пути для предотвращения ошибок при навигации
  useEffect(() => {
    // Сбрасываем состояние при изменении пути
    if (isMounted) {
      // Даем время для завершения анимации перехода
      const timeout = setTimeout(() => {
        // Ничего не делаем, просто обновляем компонент
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [pathname, isMounted]);

  // Устанавливаем флаг монтирования
  useEffect(() => {
    try {
      setIsMounted(true);
      
      return () => {
        // Очистка при размонтировании
        setIsMounted(false);
      };
    } catch (error) {
      console.error('Error in TonConnectProvider:', error);
    }
  }, []);

  if (!isMounted) {
    // Возвращаем пустой div с такой же структурой, как и в children
    return <div className="min-h-screen p-8 pb-24 bg-gray-900" />;
  }

  return <>{children}</>;
} 
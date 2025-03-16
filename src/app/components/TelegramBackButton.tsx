'use client';

import { useEffect } from 'react';
import { useTelegram } from '../providers/TelegramProvider';
import { useRouter } from 'next/navigation';

// Определяем тип для BackButton
interface TelegramBackButtonType {
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  [key: string]: any;
}

interface TelegramBackButtonProps {
  onClick?: () => void;
  isVisible?: boolean;
}

export default function TelegramBackButton({
  onClick,
  isVisible = true,
}: TelegramBackButtonProps) {
  const { webApp, isReady } = useTelegram();
  const router = useRouter();

  useEffect(() => {
    if (!isReady || !webApp) return;

    try {
      // @ts-ignore - Приводим к нашему типу
      const backButton: TelegramBackButtonType = webApp.BackButton;

      // Настраиваем видимость кнопки
      if (isVisible) {
        backButton.show();
      } else {
        backButton.hide();
      }

      // Добавляем обработчик клика
      const handleClick = () => {
        if (onClick) {
          onClick();
        } else {
          // По умолчанию возвращаемся на предыдущую страницу
          router.back();
        }
      };

      backButton.onClick(handleClick);

      // Очистка при размонтировании
      return () => {
        backButton.offClick(handleClick);
        backButton.hide();
      };
    } catch (error) {
      console.error('Ошибка при настройке BackButton:', error);
    }
  }, [isReady, webApp, isVisible, onClick, router]);

  // Компонент не рендерит никакой UI, он только управляет кнопкой Telegram
  return null;
} 
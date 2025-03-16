'use client';

import { useEffect } from 'react';
import { useTelegram } from '../providers/TelegramProvider';
import { useTranslation } from '../hooks/useTranslation';

// Расширяем тип WebApp для включения методов ready, expand и onEvent
interface TelegramWebAppExtended {
  ready: () => void;
  expand: () => void;
  onEvent: (eventName: string, callback: () => void) => void;
  [key: string]: any;
}

interface TelegramMiniAppProps {
  title?: string;
  children: React.ReactNode;
}

export default function TelegramMiniApp({ title, children }: TelegramMiniAppProps) {
  const { webApp, isReady, themeParams } = useTelegram();
  const { t } = useTranslation();

  // Устанавливаем заголовок приложения
  useEffect(() => {
    if (isReady && webApp && title) {
      try {
        // Устанавливаем заголовок в Telegram Mini App
        document.title = title;
        
        // Настраиваем цвета в соответствии с темой Telegram
        if (document.documentElement) {
          document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.backgroundColor);
          document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.textColor);
          document.documentElement.style.setProperty('--tg-theme-button-color', themeParams.buttonColor);
          document.documentElement.style.setProperty('--tg-theme-button-text-color', themeParams.buttonTextColor);
        }
      } catch (error) {
        console.error('Ошибка при настройке Telegram Mini App:', error);
      }
    }
  }, [isReady, webApp, title, themeParams]);

  // Сообщаем Telegram, что приложение готово
  useEffect(() => {
    if (isReady && webApp) {
      try {
        // @ts-ignore - Приводим к нашему типу с нужными методами
        const tgWebApp = webApp as TelegramWebAppExtended;
        
        // Сообщаем Telegram, что приложение готово
        tgWebApp.ready();
        
        // Расширяем приложение на весь экран
        tgWebApp.expand();
        
        // Настраиваем обработчик события закрытия приложения
        tgWebApp.onEvent('viewportChanged', () => {
          console.log('Viewport changed');
        });
      } catch (error) {
        console.error('Ошибка при инициализации Telegram Mini App:', error);
      }
    }
  }, [isReady, webApp]);

  return (
    <div className="telegram-mini-app">
      {children}
    </div>
  );
} 
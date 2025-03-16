'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

// Расширяем типы для Telegram WebApp
interface TelegramUser {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
}

interface TelegramThemeParams {
  button_color?: string;
  button_text_color?: string;
  [key: string]: any;
}

interface TelegramInitDataUnsafe {
  user?: TelegramUser;
  [key: string]: any;
}

interface TelegramWebAppExtended {
  initData: string;
  initDataUnsafe: TelegramInitDataUnsafe;
  colorScheme?: 'light' | 'dark';
  themeParams?: TelegramThemeParams;
  ready: () => void;
  BackButton: {
    show: () => void;
    hide: () => void;
    [key: string]: any;
  };
  MainButton: {
    show: () => void;
    hide: () => void;
    [key: string]: any;
  };
  [key: string]: any;
}

// Создаем контекст для Telegram Web App
interface TelegramContextType {
  webApp: typeof WebApp | null;
  isReady: boolean;
  user: {
    id: number | null;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  themeParams: {
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
  };
}

const defaultThemeParams = {
  backgroundColor: '#1f2937', // bg-gray-900
  textColor: '#ffffff',       // text-white
  buttonColor: '#3b82f6',     // bg-blue-500
  buttonTextColor: '#ffffff', // text-white
};

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  isReady: false,
  user: {
    id: null,
    username: null,
    firstName: null,
    lastName: null,
  },
  themeParams: defaultThemeParams,
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

export default function TelegramProvider({ children }: TelegramProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [webApp, setWebApp] = useState<typeof WebApp | null>(null);
  const [user, setUser] = useState({
    id: null as number | null,
    username: null as string | null,
    firstName: null as string | null,
    lastName: null as string | null,
  });
  const [themeParams, setThemeParams] = useState(defaultThemeParams);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Инициализируем Telegram Web App
        const tgWebApp = WebApp;
        setWebApp(tgWebApp);

        // Проверяем, запущено ли приложение в Telegram
        if (tgWebApp.initData) {
          // Устанавливаем флаг готовности
          setIsReady(true);

          // Приводим к расширенному типу
          const extendedWebApp = tgWebApp as unknown as TelegramWebAppExtended;

          // Получаем данные пользователя
          if (extendedWebApp.initDataUnsafe.user) {
            const tgUser = extendedWebApp.initDataUnsafe.user;
            setUser({
              id: tgUser.id || null,
              username: tgUser.username || null,
              firstName: tgUser.first_name || null,
              lastName: tgUser.last_name || null,
            });
          }

          // Получаем параметры темы
          if (extendedWebApp.colorScheme) {
            const isDark = extendedWebApp.colorScheme === 'dark';
            setThemeParams({
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              textColor: isDark ? '#ffffff' : '#000000',
              buttonColor: extendedWebApp.themeParams?.button_color || '#3b82f6',
              buttonTextColor: extendedWebApp.themeParams?.button_text_color || '#ffffff',
            });
          }

          // Сообщаем Telegram, что приложение готово
          extendedWebApp.ready();
          
          // Настраиваем кнопку "Назад"
          extendedWebApp.BackButton.hide();
          
          // Настраиваем основную кнопку
          extendedWebApp.MainButton.hide();
        } else {
          console.log('Приложение запущено не в Telegram Web App');
          setIsReady(false);
        }
      } catch (error) {
        console.error('Ошибка при инициализации Telegram Web App:', error);
        setIsReady(false);
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, isReady, user, themeParams }}>
      {children}
    </TelegramContext.Provider>
  );
} 
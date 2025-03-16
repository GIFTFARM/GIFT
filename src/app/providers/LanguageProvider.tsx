'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

// Ключ для хранения языка в localStorage
const LANGUAGE_STORAGE_KEY = 'gift_language';

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Инициализируем состояние с функцией, которая будет вызвана только один раз
  const [language, setLanguageState] = useState<Language>(() => {
    // Проверяем, что мы на клиенте (в браузере)
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      // Возвращаем сохраненный язык, если он валидный, иначе 'ru'
      return (savedLanguage === 'ru' || savedLanguage === 'en') ? savedLanguage as Language : 'ru';
    }
    // По умолчанию возвращаем 'ru'
    return 'ru';
  });

  // Синхронизируем состояние с localStorage при изменении языка
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  // Дополнительная проверка при монтировании компонента
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage === 'ru' || savedLanguage === 'en') {
        if (savedLanguage !== language) {
          setLanguageState(savedLanguage as Language);
        }
      } else {
        // Если в localStorage нет языка или он невалидный, устанавливаем 'ru'
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'ru' ? 'en' : 'ru';
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
} 
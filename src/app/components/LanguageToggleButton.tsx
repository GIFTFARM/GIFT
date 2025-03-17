'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '../providers/LanguageProvider';

interface LanguageToggleButtonProps {
  className?: string;
}

export default function LanguageToggleButton({ className = '' }: LanguageToggleButtonProps) {
  const { language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Эффект для проверки монтирования компонента
  useEffect(() => {
    setMounted(true);
  }, []);

  // Если компонент не смонтирован, показываем заглушку
  if (!mounted) {
    return (
      <button
        className={`w-10 h-10 flex items-center justify-center bg-white/10 text-gray-400 rounded-full relative z-30 ${className}`}
      >
        <span className="font-bold text-sm opacity-0">RU</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-amber-500/30 text-gray-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110 relative z-30 hover:shadow-md hover:shadow-amber-500/20 ${className}`}
      title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
    >
      <span className="font-bold text-sm">
        {language === 'ru' ? 'EN' : 'RU'}
      </span>
    </button>
  );
} 
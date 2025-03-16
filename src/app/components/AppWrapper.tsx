'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import TelegramMiniApp from './TelegramMiniApp';
import { useTelegram } from '../providers/TelegramProvider';

interface AppWrapperProps {
  children: React.ReactNode;
}

// Ключи для хранения данных в localStorage
const STORAGE_KEYS = {
  WALLET_BALANCE: 'gift_wallet_balance',
  PRO_STATUS: 'gift_pro_status',
  TICKETS: 'gift_tickets',
  GIFT_BALANCE: 'gift_balance',
};

export default function AppWrapper({ children }: AppWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isReady: isTelegramReady } = useTelegram();
  
  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Проверяем при загрузке
    checkMobile();
    
    // Проверяем при изменении размера окна
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Показываем загрузочный экран при каждом открытии приложения
  useEffect(() => {
    // Загрузочный экран будет показываться каждый раз
    // Никаких проверок sessionStorage не нужно
    
    // Можно добавить небольшую задержку, чтобы загрузочный экран 
    // показывался даже если страница загрузилась очень быстро
    const timer = setTimeout(() => {
      // Ничего не делаем, просто даем время для отображения загрузочного экрана
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Инициализация localStorage при первом запуске приложения
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Проверяем, есть ли уже данные в localStorage
      const hasTickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
      
      // Если данных нет, инициализируем их
      if (!hasTickets) {
        console.log('Инициализация localStorage: добавляем 10 стартовых билетиков');
        localStorage.setItem(STORAGE_KEYS.TICKETS, '10');
      }
      
      // Проверяем другие ключи и инициализируем их при необходимости
      if (!localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE)) {
        localStorage.setItem(STORAGE_KEYS.WALLET_BALANCE, '0');
      }
      
      if (!localStorage.getItem(STORAGE_KEYS.GIFT_BALANCE)) {
        localStorage.setItem(STORAGE_KEYS.GIFT_BALANCE, '0');
      }
      
      if (!localStorage.getItem(STORAGE_KEYS.PRO_STATUS)) {
        localStorage.setItem(STORAGE_KEYS.PRO_STATUS, 'false');
      }
      
      // Добавляем мета-тег viewport для мобильных устройств
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
        document.head.appendChild(meta);
      } else {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
      }
    }
  }, []);
  
  const handleLoadingComplete = () => {
    setIsLoading(false);
    
    // Добавляем небольшую задержку перед показом контента для плавности
    setTimeout(() => {
      setContentVisible(true);
    }, 100);
  };
  
  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <div 
        className={`transition-opacity duration-500 ease-in-out ${
          contentVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {isTelegramReady ? (
          <TelegramMiniApp title="GIFT FARM - Фарминг NFT">
            {children}
          </TelegramMiniApp>
        ) : (
          children
        )}
      </div>
    </>
  );
} 
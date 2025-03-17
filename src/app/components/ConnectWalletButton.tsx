'use client';

import { useEffect, useRef, useState } from 'react';
import { useTonConnect } from '../hooks/useTonConnect';

export default function ConnectWalletButton() {
  const { tonConnectUI, isConnected } = useTonConnect();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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
  
  useEffect(() => {
    // Устанавливаем флаг монтирования
    setMounted(true);
    
    // Проверяем, что компонент смонтирован и tonConnectUI инициализирован
    if (buttonRef.current && tonConnectUI) {
      try {
        // Убедимся, что div пустой перед рендерингом кнопки
        if (buttonRef.current.children.length === 0) {
          // TonConnectUI автоматически рендерит кнопку в элемент с id="connect-wallet"
          // Нам не нужно вызывать render() явно
        }
      } catch (error) {
        console.error('Error with TonConnect button:', error);
      }
    }
  }, [tonConnectUI, buttonRef]);

  // Добавляем стили к кнопке после монтирования
  useEffect(() => {
    if (mounted && buttonRef.current) {
      // Находим кнопку внутри контейнера
      const button = buttonRef.current.querySelector('button');
      if (button) {
        // Добавляем наши стили к кнопке
        button.classList.add(
          'transition-all', 
          'duration-300', 
          'hover:scale-105', 
          'shadow-lg',
          'hover:shadow-amber-500/20',
          'rounded-[1.5rem]',
          'border',
          'border-white/10'
        );

        // Если пользователь подключен, добавляем дополнительные стили
        if (isConnected) {
          button.classList.add(
            'bg-gradient-to-r',
            'from-amber-500/80',
            'to-yellow-600/80',
            'hover:from-amber-400/80',
            'hover:to-yellow-500/80'
          );
        }
        
        // Добавляем стили для мобильных устройств
        if (isMobile) {
          button.classList.add(
            'text-sm',
            'py-2',
            'px-3'
          );
          
          // Находим иконку внутри кнопки и уменьшаем её размер
          const icon = button.querySelector('img');
          if (icon) {
            icon.style.width = '20px';
            icon.style.height = '20px';
            icon.style.marginRight = '6px';
          }
        }
      }
    }
  }, [mounted, isConnected, isMobile]);
  
  return (
    <div 
      id="connect-wallet" 
      ref={buttonRef} 
      className={`transition-all duration-500 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'} relative z-30`}
    />
  );
} 
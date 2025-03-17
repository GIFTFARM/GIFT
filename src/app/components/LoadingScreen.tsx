'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [dots, setDots] = useState('');
  
  // Анимация точек загрузки
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);
    
    return () => clearInterval(dotsInterval);
  }, []);
  
  useEffect(() => {
    const duration = 4000; // 4 секунды
    const interval = 50; // Обновление каждые 50мс
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      
      if (currentProgress >= 100) {
        clearInterval(timer);
        setProgress(100);
        
        // Запускаем анимацию исчезновения
        setTimeout(() => {
          setFadeOut(true);
          
          // Вызываем колбэк после завершения анимации исчезновения
          setTimeout(() => {
            onLoadingComplete();
          }, 500); // Время анимации исчезновения
        }, 300);
      } else {
        setProgress(currentProgress);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [onLoadingComplete]);
  
  // Получаем текущий статус загрузки
  const getLoadingStatus = () => {
    if (progress < 30) return "Подключение к блокчейну";
    if (progress >= 30 && progress < 60) return "Загрузка данных";
    if (progress >= 60 && progress < 90) return "Подготовка интерфейса";
    return "Готово!";
  };
  
  return (
    <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-full max-w-md px-4 sm:px-8 flex flex-col items-center">
        <div className="mb-8 sm:mb-12 relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-black rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-white/10 relative">
            <span className="text-4xl sm:text-6xl transform -rotate-12">🎁</span>
            
            {/* Анимированные частицы вокруг иконки */}
            <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-3 h-3 sm:w-4 sm:h-4 bg-amber-500/80 rounded-full animate-ping-slow"></div>
            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-2 h-2 sm:w-3 sm:h-3 bg-amber-600/80 rounded-full animate-ping-slow animation-delay-500"></div>
            <div className="absolute top-1/2 -right-2 sm:-right-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-1000"></div>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">
          <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            GIFT FARM
          </span>
        </h1>
        
        <div className="w-full bg-white/5 h-2 sm:h-3 rounded-full mb-3 sm:mb-4 overflow-hidden relative">
          {/* Фоновый градиент для прогресс-бара */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 animate-pulse-slow"></div>
          
          {/* Основной прогресс-бар */}
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Эффект свечения на краю прогресс-бара */}
            <div className="absolute right-0 top-0 bottom-0 w-3 sm:w-4 bg-white/30 blur-sm"></div>
          </div>
        </div>
        
        <div className="h-6 flex items-center justify-center">
          <p className={`text-sm sm:text-base text-gray-400 text-center transition-opacity duration-300 ${progress === 100 ? 'text-amber-400 font-medium' : ''}`}>
            {getLoadingStatus()}{progress < 100 ? dots : ''}
          </p>
        </div>
      </div>
      
      {/* Анимированные элементы фона */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-r from-amber-500/10 to-yellow-600/5 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/3 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-yellow-600/10 to-amber-500/5 rounded-full filter blur-3xl animate-pulse-slow animation-delay-1000"></div>
    </div>
  );
} 
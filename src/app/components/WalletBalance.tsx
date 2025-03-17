'use client';

import { useState, useEffect } from 'react';
import { useTonConnect } from '../hooks/useTonConnect';
import { useTranslation } from '../hooks/useTranslation';
import { CrownIcon } from './Icons';

export default function WalletBalance() {
  const { walletBalance, isPro } = useTonConnect();
  const { t } = useTranslation();
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
  
  // Эффект для анимации появления при загрузке
  useEffect(() => {
    setMounted(true);
  }, []);

  if (isMobile) {
    return (
      <div 
        className={`fixed top-0 left-0 right-0 z-30 p-2 flex justify-center transition-all duration-500 transform ${
          mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
      >
        <div className="px-3 py-1.5 flex items-center gap-1.5">
          <div className="flex items-center">
            <span className="text-xs text-gray-400 drop-shadow-md">{t('inWallet')}:</span>
            <span className="ml-1.5 text-sm font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-md">{walletBalance.toFixed(2)} GIFT</span>
          </div>
          {isPro && (
            <div className="ml-1.5 bg-gradient-to-r from-amber-500/80 to-yellow-600/80 px-1.5 py-0.5 rounded-full border border-yellow-500/50 flex items-center gap-0.5">
              <CrownIcon className="w-2.5 h-2.5 text-white" />
              <span className="text-[10px] font-medium text-white">PRO</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`transition-all duration-500 transform ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      }`}
    >
      <div className="px-4 py-2 flex items-center gap-2 transform transition-all duration-300 hover:translate-y-[-2px]">
        <div>
          <span className="text-sm text-gray-400 drop-shadow-md">{t('inWallet')}:</span>
          <span className="ml-2 font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-md">{walletBalance.toFixed(2)} GIFT</span>
        </div>
        {isPro && (
          <div className="ml-2 bg-gradient-to-r from-amber-500/80 to-yellow-600/80 px-2 py-0.5 rounded-full border border-yellow-500/50 flex items-center gap-1">
            <CrownIcon className="w-3 h-3 text-white" />
            <span className="text-xs font-medium text-white">PRO</span>
          </div>
        )}
      </div>
    </div>
  );
} 
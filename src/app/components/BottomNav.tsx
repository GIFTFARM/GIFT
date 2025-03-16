import { useRouter, usePathname } from 'next/navigation';
import { HomeIcon, ReferralsIcon, ProfileIcon, EarnIcon } from './Icons';
import { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  
  // Эффект для анимации появления при загрузке
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-1 sm:p-2 flex justify-center pointer-events-none z-40">
      <div 
        className={`max-w-lg w-full backdrop-blur-sm rounded-2xl sm:rounded-[1.5rem] overflow-hidden pointer-events-auto transition-all duration-500 transform ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="flex justify-around items-center relative">
          <button
            onClick={() => router.push('/')}
            className={`flex-1 flex flex-col items-center py-1.5 sm:py-2 px-1 sm:px-2 transition-all duration-300 relative overflow-hidden ${
              pathname === '/' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {/* Фоновый эффект для активной кнопки */}
            {pathname === '/' && (
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-transparent opacity-50"></div>
            )}
            
            <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg sm:rounded-xl flex items-center justify-center transform transition-all duration-300 ${
              pathname === '/' 
                ? 'rotate-12 shadow-lg shadow-amber-500/20 scale-110 bg-gradient-to-br from-gray-800 to-black' 
                : 'hover:scale-105'
            }`}>
              <HomeIcon className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-300 ${pathname === '/' ? '-rotate-12 text-amber-400' : ''}`} />
              
              {/* Анимированные частицы для активной кнопки */}
              {pathname === '/' && (
                <>
                  <div className="absolute -top-1 -right-1 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-500/80 rounded-full animate-ping-slow"></div>
                  <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
                </>
              )}
            </div>
            <span className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 font-medium transition-all duration-300 ${
              pathname === '/' ? 'text-amber-400' : ''
            }`}>{t('main')}</span>
          </button>

          <button
            onClick={() => router.push('/earn')}
            className={`flex-1 flex flex-col items-center py-1.5 sm:py-2 px-1 sm:px-2 transition-all duration-300 relative overflow-hidden ${
              pathname === '/earn' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {/* Фоновый эффект для активной кнопки */}
            {pathname === '/earn' && (
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-transparent opacity-50"></div>
            )}
            
            <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg sm:rounded-xl flex items-center justify-center transform transition-all duration-300 ${
              pathname === '/earn' 
                ? 'rotate-12 shadow-lg shadow-amber-500/20 scale-110 bg-gradient-to-br from-gray-800 to-black' 
                : 'hover:scale-105'
            }`}>
              <EarnIcon className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-300 ${pathname === '/earn' ? '-rotate-12 text-amber-400' : ''}`} />
              
              {/* Анимированные частицы для активной кнопки */}
              {pathname === '/earn' && (
                <>
                  <div className="absolute -top-1 -right-1 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-500/80 rounded-full animate-ping-slow"></div>
                  <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
                </>
              )}
            </div>
            <span className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 font-medium transition-all duration-300 ${
              pathname === '/earn' ? 'text-amber-400' : ''
            }`}>{t('earn')}</span>
          </button>

          <button
            onClick={() => router.push('/referrals')}
            className={`flex-1 flex flex-col items-center py-1.5 sm:py-2 px-1 sm:px-2 transition-all duration-300 relative overflow-hidden ${
              pathname === '/referrals' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {/* Фоновый эффект для активной кнопки */}
            {pathname === '/referrals' && (
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-transparent opacity-50"></div>
            )}
            
            <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg sm:rounded-xl flex items-center justify-center transform transition-all duration-300 ${
              pathname === '/referrals' 
                ? 'rotate-12 shadow-lg shadow-amber-500/20 scale-110 bg-gradient-to-br from-gray-800 to-black' 
                : 'hover:scale-105'
            }`}>
              <ReferralsIcon className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-300 ${pathname === '/referrals' ? '-rotate-12 text-amber-400' : ''}`} />
              
              {/* Анимированные частицы для активной кнопки */}
              {pathname === '/referrals' && (
                <>
                  <div className="absolute -top-1 -right-1 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-500/80 rounded-full animate-ping-slow"></div>
                  <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
                </>
              )}
            </div>
            <span className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 font-medium transition-all duration-300 ${
              pathname === '/referrals' ? 'text-amber-400' : ''
            }`}>{t('referrals')}</span>
          </button>

          <button
            onClick={() => router.push('/profile')}
            className={`flex-1 flex flex-col items-center py-1.5 sm:py-2 px-1 sm:px-2 transition-all duration-300 relative overflow-hidden ${
              pathname === '/profile' 
                ? 'text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {/* Фоновый эффект для активной кнопки */}
            {pathname === '/profile' && (
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-transparent opacity-50"></div>
            )}
            
            <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg sm:rounded-xl flex items-center justify-center transform transition-all duration-300 ${
              pathname === '/profile' 
                ? 'rotate-12 shadow-lg shadow-amber-500/20 scale-110 bg-gradient-to-br from-gray-800 to-black' 
                : 'hover:scale-105'
            }`}>
              <ProfileIcon className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-300 ${pathname === '/profile' ? '-rotate-12 text-amber-400' : ''}`} />
              
              {/* Анимированные частицы для активной кнопки */}
              {pathname === '/profile' && (
                <>
                  <div className="absolute -top-1 -right-1 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-500/80 rounded-full animate-ping-slow"></div>
                  <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
                </>
              )}
            </div>
            <span className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 font-medium transition-all duration-300 ${
              pathname === '/profile' ? 'text-amber-400' : ''
            }`}>{t('profile')}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 
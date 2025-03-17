'use client';

import BottomNav from '../components/BottomNav';
import { useRouter } from 'next/navigation';
import ConnectWalletButton from '../components/ConnectWalletButton';
import { useEffect, useState } from 'react';
import { 
  GiftIcon, 
  LightningIcon, 
  StarIcon, 
  CrownIcon, 
  WalletIcon, 
  ImageIcon,
  TicketIcon,
  GamepadIcon
} from '../components/Icons';
import LanguageToggleButton from '../components/LanguageToggleButton';
import { useTranslation } from '../hooks/useTranslation';

export default function Welcome() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  
  // Эффект для анимации появления при загрузке
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <main className="min-h-screen p-8 pb-24 bg-gradient-to-b from-black to-gray-900">
      {/* Декоративные элементы */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="absolute top-0 right-0 flex items-center gap-4">
          <LanguageToggleButton />
          <ConnectWalletButton />
        </div>
        
        <h1 className={`text-4xl font-bold mb-12 text-center flex items-center justify-center gap-4 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50"></div>
            <GiftIcon className="w-10 h-10 text-white transform -rotate-12 relative z-10" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500/80 rounded-full animate-ping-slow"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
          </div>
          <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {t('welcomeTitle')}
          </span>
        </h1>

        <div className={`bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-[3rem] p-8 border border-white/10 shadow-xl shadow-black/20 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
            <StarIcon className="w-6 h-6 text-amber-400" /> {t('welcomeHowToStart')}
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-[1.5rem] border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center shrink-0">
                  <WalletIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-amber-300">{t('welcomeStep1Title')}</h3>
                  <p className="text-gray-300">
                    {t('welcomeStep1Desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-[1.5rem] border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center shrink-0">
                  <ImageIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-amber-300">{t('welcomeStep2Title')}</h3>
                  <p className="text-gray-300">
                    {t('welcomeStep2Desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-[1.5rem] border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center shrink-0">
                  <LightningIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-amber-300">{t('welcomeStep3Title')}</h3>
                  <p className="text-gray-300">
                    {t('welcomeStep3Desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-[1.5rem] border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center shrink-0">
                  <CrownIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-amber-300">{t('welcomeStep4Title')}</h3>
                  <ul className="list-none space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      </div>
                      {t('welcomeProFeature1')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      </div>
                      {t('welcomeProFeature2')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      </div>
                      {t('welcomeProFeature3')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-[1.5rem] border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center shrink-0">
                  <TicketIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-amber-300">{t('welcomeStep5Title')}</h3>
                  <p className="text-gray-300">
                    {t('welcomeStep5Desc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-6 rounded-[1.5rem] border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center shrink-0">
                  <GamepadIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-amber-300">6. {t('earn')}</h3>
                  <p className="text-gray-300">
                    {t('playAndEarn')}. {t('ticketsInfo')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 rounded-[1.5rem] font-medium text-white shadow-lg hover:shadow-amber-500/20 transform hover:translate-y-[-2px] transition-all duration-300 border border-yellow-500/50"
            >
              {t('welcomeStartButton')}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p className="mb-1">{t('welcomeFooter1')}</p>
          <p>{t('welcomeFooter2')}</p>
        </div>
      </div>
      <BottomNav />
    </main>
  );
} 
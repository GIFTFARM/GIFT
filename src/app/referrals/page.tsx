'use client';

import { useState, useEffect } from 'react';
import { useReferrals } from '../hooks/useReferrals';
import BottomNav from '../components/BottomNav';
import ConnectWalletButton from '../components/ConnectWalletButton';
import { useRouter } from 'next/navigation';
import { useTonConnect } from '../hooks/useTonConnect';
import { 
  ReferralsIcon, 
  GiftIcon, 
  CoinsIcon, 
  CheckIcon, 
  QuestionIcon,
  SearchIcon,
  WalletIcon,
  CopyIcon
} from '../components/Icons';
import LanguageToggleButton from '../components/LanguageToggleButton';
import WalletBalance from '../components/WalletBalance';
import { useLanguage } from '../providers/LanguageProvider';
import { getTranslation } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';

export default function ReferralsPage() {
  const { referralData, referralLink, isLoading, copyReferralLink, claimReferralBonus } = useReferrals();
  const [copied, setCopied] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isConnected, userAddress } = useTonConnect();
  const { language } = useLanguage();
  const { t } = useTranslation();

  // Эффект для анимации появления при загрузке
  useEffect(() => {
    setMounted(true);
  }, []);

  // Сбрасываем статус копирования через 3 секунды
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Сбрасываем статус получения бонуса через 3 секунды
  useEffect(() => {
    if (claimed) {
      const timer = setTimeout(() => {
        setClaimed(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [claimed]);

  const handleCopyLink = async () => {
    const success = await copyReferralLink();
    if (success) {
      setCopied(true);
    }
  };

  const handleClaimBonus = () => {
    const success = claimReferralBonus();
    if (success) {
      setClaimed(true);
    }
  };

  return (
    <main className="min-h-screen p-8 pb-24 bg-gradient-to-b from-black to-gray-900">
      {/* Декоративные элементы */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
      
      {/* Отображаем баланс кошелька для мобильных устройств */}
      {isConnected && <WalletBalance />}
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-3 absolute top-4 right-4 z-30">
          <LanguageToggleButton />
          <button 
            onClick={() => router.push('/welcome')}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-amber-500/30 text-gray-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110 relative z-30 hover:shadow-md hover:shadow-amber-500/20"
            title="Узнать больше о проекте"
          >
            <QuestionIcon className="w-5 h-5" />
          </button>
          <ConnectWalletButton />
        </div>
        
        <h1 className={`text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50"></div>
            <ReferralsIcon className="w-8 h-8 text-white transform -rotate-12 relative z-10" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500/80 rounded-full animate-ping-slow"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
          </div>
          <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {t('referrals').toUpperCase()}
          </span>
        </h1>

        {isConnected ? (
          <div className={`p-8 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <ReferralsIcon className="w-5 h-5 text-amber-400" /> {t('referralProgramTitle')}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t('referralProgramDesc')}
                </p>

                <div className="bg-gradient-to-r from-black/50 to-gray-900/50 p-6 rounded-[2rem] border border-white/10 mb-8 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/5 relative overflow-hidden">
                  {/* Декоративный элемент */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                  
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2 relative z-10">
                    <ReferralsIcon className="w-4 h-4 text-amber-400" /> {t('yourReferralLink')}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                    <input
                      type="text"
                      readOnly
                      value={isLoading ? t('loading') : referralLink}
                      className="flex-1 bg-black/30 px-4 py-3 rounded-[1.5rem] text-gray-300 border border-white/5 shadow-inner"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className={`px-6 py-3 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 ${
                        copied 
                          ? 'bg-gradient-to-r from-green-500/80 to-green-600/80 shadow-lg shadow-green-500/20' 
                          : 'bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 shadow-lg hover:shadow-amber-500/20'
                      }`}
                    >
                      {copied ? (
                        <span className="flex items-center gap-2">
                          <CheckIcon className="w-4 h-4 text-green-200" /> {t('copied')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CopyIcon className="w-4 h-4" /> {t('copy')}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-5 rounded-[1.5rem] text-center border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="w-12 h-12 mx-auto mb-2 bg-black/30 rounded-full flex items-center justify-center">
                      <ReferralsIcon className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-sm text-gray-400">{t('referralsCount')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {isLoading ? "..." : referralData.referrals.length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-5 rounded-[1.5rem] text-center border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="w-12 h-12 mx-auto mb-2 bg-black/30 rounded-full flex items-center justify-center">
                      <GiftIcon className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-sm text-gray-400">{t('earned')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {isLoading ? "..." : referralData.totalEarned.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-5 rounded-[1.5rem] text-center border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="w-12 h-12 mx-auto mb-2 bg-black/30 rounded-full flex items-center justify-center">
                      <CoinsIcon className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-sm text-gray-400">{t('bonus')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">5%</p>
                  </div>
                </div>

                <div className="relative bg-gradient-to-r from-black/50 to-gray-900/50 p-6 rounded-[2rem] border border-white/10 mb-8 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/5 overflow-hidden">
                  {/* Декоративный элемент */}
                  <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="text-lg text-gray-300">{t('availableToCollect')}:</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                          {isLoading ? "..." : referralData.totalEarned.toFixed(2)} <span className="text-amber-400">GIFT</span>
                        </p>
                      </div>
                      <button 
                        onClick={handleClaimBonus}
                        disabled={claimed || referralData.totalEarned <= 0}
                        className={`px-6 py-3 rounded-[1.5rem] transition-all duration-300 ${
                          claimed 
                            ? 'bg-gradient-to-r from-green-500/80 to-green-600/80 shadow-lg shadow-green-500/20' 
                            : referralData.totalEarned <= 0
                              ? 'bg-white/10 cursor-not-allowed opacity-50'
                              : 'bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 shadow-lg hover:shadow-amber-500/20'
                        }`}
                      >
                        {claimed ? (
                          <span className="flex items-center gap-2">
                            <CheckIcon className="w-4 h-4 text-green-200" /> {t('bonusCollected')}
                          </span>
                        ) : (
                          t('getBonus')
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-black/50 to-gray-900/50 p-6 rounded-[2rem] border border-white/10 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/5 relative overflow-hidden">
                  {/* Декоративный элемент */}
                  <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl"></div>
                  
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2 relative z-10">
                    <SearchIcon className="w-4 h-4 text-amber-400" /> {t('howItWorks')}
                  </h3>
                  <ol className="list-decimal list-inside space-y-4 text-gray-300 pl-2 relative z-10">
                    <li className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 transform transition-all duration-300 hover:translate-y-[-2px] hover:bg-white/10">
                      <span className="bg-black/30 w-8 h-8 rounded-full flex items-center justify-center text-amber-400 font-bold shrink-0">1</span>
                      <div>
                        <p className="font-medium text-white">{t('copyReferralLink')}</p>
                        <p className="text-sm text-gray-400 mt-1">{t('copy')}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 transform transition-all duration-300 hover:translate-y-[-2px] hover:bg-white/10">
                      <span className="bg-black/30 w-8 h-8 rounded-full flex items-center justify-center text-amber-400 font-bold shrink-0">2</span>
                      <div>
                        <p className="font-medium text-white">{t('shareLink')}</p>
                        <p className="text-sm text-gray-400 mt-1">{t('shareLink')}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 transform transition-all duration-300 hover:translate-y-[-2px] hover:bg-white/10">
                      <span className="bg-black/30 w-8 h-8 rounded-full flex items-center justify-center text-amber-400 font-bold shrink-0">3</span>
                      <div>
                        <p className="font-medium text-white">{t('getReferralBonus')}</p>
                        <p className="text-sm text-gray-400 mt-1">{t('getReferralBonus')}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 transform transition-all duration-300 hover:translate-y-[-2px] hover:bg-white/10">
                      <span className="bg-black/30 w-8 h-8 rounded-full flex items-center justify-center text-amber-400 font-bold shrink-0">4</span>
                      <div>
                        <p className="font-medium text-white">{t('getPassiveIncome')}</p>
                        <p className="text-sm text-gray-400 mt-1">{t('getPassiveIncome')}</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`text-center transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-amber-500/20 relative overflow-hidden mb-6">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50"></div>
              <ReferralsIcon className="w-10 h-10 text-white transform -rotate-12 relative z-10" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500/80 rounded-full animate-ping-slow"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">{t('connectWallet')}</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {t('connectWalletToStart')}
            </p>
            <div className="flex justify-center">
              <ConnectWalletButton />
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
} 
'use client';

import BottomNav from '../components/BottomNav';
import { useTonConnect } from '../hooks/useTonConnect';
import { useFarming } from '../hooks/useFarming';
import ConnectWalletButton from '../components/ConnectWalletButton';
import { useRouter } from 'next/navigation';
import { toV4Address } from '../utils/address';
import { useEffect, useState } from 'react';
import { getUserNFTs } from '../utils/nft';
import { 
  ProfileIcon, 
  WalletIcon, 
  StarIcon, 
  CrownIcon, 
  GiftIcon,
  QuestionIcon,
  CheckIcon,
  ClockIcon,
  ImageIcon,
  LightningIcon,
  CopyIcon,
  StatsIcon,
  TicketIcon
} from '../components/Icons';
import LanguageToggleButton from '../components/LanguageToggleButton';
import { useLanguage } from '../providers/LanguageProvider';
import { getTranslation } from '../utils/translations';
import { useTranslation } from '../hooks/useTranslation';
import WalletBalance from '../components/WalletBalance';

export default function ProfilePage() {
  const router = useRouter();
  const { isConnected, userAddress } = useTonConnect();
  const { walletBalance, isPro, proExpiresAt, stats, updateNFTs, tickets } = useFarming();
  const [mounted, setMounted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation();

  // Получаем адрес в формате v4
  const formattedAddress = userAddress ? toV4Address(userAddress) : '';

  // Эффект для анимации появления при загрузке
  useEffect(() => {
    setMounted(true);
  }, []);

  // Загрузка NFT при открытии профиля
  useEffect(() => {
    const loadNFTs = async () => {
      if (!isConnected || !userAddress) return;
      
      setIsLoading(true);
      try {
        const userNFTs = await getUserNFTs(userAddress);
        updateNFTs(userNFTs);
      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNFTs();
  }, [isConnected, userAddress, updateNFTs]);

  // Функция для копирования адреса
  const copyAddress = () => {
    navigator.clipboard.writeText(formattedAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <main className="min-h-screen p-8 pb-24 bg-gradient-to-b from-black to-gray-900">
      {/* Декоративные элементы */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
      
      {/* Отображаем баланс кошелька для мобильных устройств */}
      {isConnected && <WalletBalance />}
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-3 absolute top-4 right-4 z-30">
          <LanguageToggleButton />
          <button
            onClick={() => router.push('/welcome')}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-amber-500/30 text-gray-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110 relative z-30 hover:shadow-md hover:shadow-amber-500/20"
            title={t('learnMore')}
          >
            <QuestionIcon className="w-5 h-5" />
          </button>
          <ConnectWalletButton />
        </div>
        
        <h1 className={`text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50"></div>
            <ProfileIcon className="w-8 h-8 text-white transform -rotate-12 relative z-10" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500/80 rounded-full animate-ping-slow"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
          </div>
          <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {t('profile').toUpperCase()}
          </span>
        </h1>

        <div className={`p-8 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="text-center mb-8">
            {isConnected ? (
              <div className="transition-all duration-500">
                <p className="text-sm text-gray-400 mb-2">{t('yourAddress')}:</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <p className="font-mono bg-black/30 px-4 py-2 rounded-xl inline-block text-white border border-white/5 shadow-inner">
                    {formattedAddress}
                  </p>
                  <button 
                    onClick={copyAddress}
                    className={`relative bg-gradient-to-r ${copySuccess ? 'from-green-500/80 to-green-600/80' : 'from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80'} px-3 py-2 rounded-xl text-sm text-white transition-all duration-300 shadow-md hover:shadow-amber-500/20`}
                    title={t('copy')}
                  >
                    {copySuccess ? (
                      <>
                        <CheckIcon className="w-4 h-4 inline-block mr-1" /> {t('copied')}
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-4 h-4 inline-block mr-1" /> {t('copy')}
                      </>
                    )}
                    {copySuccess && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-gray-400 mb-4">{t('connectWalletForProfile')}</p>
                <div className="flex justify-center">
                  <ConnectWalletButton />
                </div>
              </div>
            )}
          </div>

          {isConnected && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-black/50 to-gray-900/50 p-4 rounded-[1.5rem] border border-white/10 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/5">
                <h3 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
                  {t('balance')}
                </h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  {walletBalance.toFixed(2)} GIFT
                </div>
              </div>

              <div className="bg-gradient-to-r from-black/50 to-gray-900/50 p-4 rounded-[1.5rem] border border-white/10 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/5">
                <h3 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
                  <TicketIcon className="w-4 h-4 text-amber-400" /> {t('ticketsTitle')}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500/30 to-yellow-600/30 transform rotate-12">
                    <TicketIcon className="w-6 h-6 text-amber-400 transform -rotate-12" />
                    {tickets > 0 && (
                      <>
                        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-500/80 rounded-full animate-ping-slow"></div>
                        <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                      {tickets} {
                        tickets === 1 
                          ? t('ticket') 
                          : tickets >= 2 && tickets <= 4 
                            ? t('tickets2to4') 
                            : t('tickets5plus')
                      }
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {t('ticketsInfo')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-black/50 to-gray-900/50 p-4 rounded-[1.5rem] border border-white/10 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/5">
                <h3 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
                  <StarIcon className="w-4 h-4 text-amber-400" /> {t('status')}
                </h3>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transform transition-all duration-500 ${isPro ? 'rotate-12 bg-gradient-to-br from-amber-500/30 to-yellow-600/30' : 'bg-white/5'}`}>
                    {isPro ? (
                      <CrownIcon className="w-6 h-6 text-amber-400 transform -rotate-12 animate-float" />
                    ) : (
                      <ProfileIcon className="w-6 h-6 text-white" />
                    )}
                    {isPro && (
                      <>
                        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-500/80 rounded-full animate-ping-slow"></div>
                        <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
                      </>
                    )}
                  </div>
                  <div>
                    <p className={`text-base font-bold ${isPro ? 'bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent' : 'text-white'}`}>
                      {isPro ? t('proAccount') : t('regularAccount')}
                    </p>
                    {isPro && proExpiresAt && (
                      <div className="mt-2 bg-gradient-to-r from-amber-500/80 to-yellow-600/80 text-white px-3 py-1 rounded-[1rem] border border-yellow-500/50 text-xs shadow-lg shadow-amber-500/20">
                        <p className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3 text-yellow-200" />
                          {t('expires')}: {new Date(proExpiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {!isPro && (
                      <button 
                        onClick={() => router.push('/')}
                        className="mt-2 bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white px-3 py-1 rounded-[1rem] text-xs shadow-md hover:shadow-amber-500/20 transition-all duration-300"
                      >
                        {t('getPROButton')}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-black/50 to-gray-900/50 p-4 rounded-[1.5rem] border border-white/10 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/5">
                <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                  <StatsIcon className="w-4 h-4 text-amber-400" /> {t('statistics')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-3 rounded-[1rem] text-center border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px]">
                    <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stats.totalNFTs}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('totalNFTs')}</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-3 rounded-[1rem] text-center border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px]">
                    <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stats.farmingNFTs}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('farming')}</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-3 rounded-[1rem] text-center border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px]">
                    <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stats.totalHoursFarmed.toFixed(1)}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('totalHoursFarming')}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-black/50 to-gray-900/50 p-4 rounded-[1.5rem] border border-white/10 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/5 relative overflow-hidden">
                {/* Декоративный элемент */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
                
                <h3 className="text-lg font-semibold mb-2 text-white flex items-center gap-2 relative z-10">
                  <GiftIcon className="w-4 h-4 text-amber-400" /> {t('referralProgram')}
                </h3>
                <p className="text-sm text-gray-300 mb-3 relative z-10">
                  {t('referralBonusInfo')}
                </p>
                <button 
                  onClick={() => router.push('/referrals')}
                  className="w-full bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white py-2 rounded-[1rem] text-sm font-medium shadow-lg hover:shadow-amber-500/20 transition-all duration-300 relative z-10"
                >
                  {t('goToReferralProgram')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </main>
  );
} 
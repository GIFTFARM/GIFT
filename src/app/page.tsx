'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTonConnect } from './hooks/useTonConnect';
import { useFarming } from './hooks/useFarming';
import { STORAGE_KEYS } from './hooks/useFarming';
import NFTGrid from './components/NFTGrid';
import { getUserNFTs } from './utils/nft';
import BottomNav from './components/BottomNav';
import { useRouter } from 'next/navigation';
import ConnectWalletButton from './components/ConnectWalletButton';
import WalletBalance from './components/WalletBalance';
import { 
  GiftIcon, 
  LightningIcon, 
  StarIcon, 
  CrownIcon, 
  CheckIcon, 
  WalletIcon, 
  ImageIcon, 
  ClockIcon, 
  RefreshIcon, 
  LoadingIcon, 
  CoinsIcon,
  QuestionIcon,
  TicketIcon
} from './components/Icons';
import LanguageToggleButton from './components/LanguageToggleButton';
import { useLanguage } from './providers/LanguageProvider';
import { getTranslation } from './utils/translations';
import { useTranslation } from './hooks/useTranslation';
import TelegramUserInfo from './components/TelegramUserInfo';
import { useTelegram } from './providers/TelegramProvider';

export default function Home() {
  const router = useRouter();
  const { isConnected, userAddress } = useTonConnect();
  const { language } = useLanguage();
  const { isReady: isTelegramReady } = useTelegram();
  const { t } = useTranslation();
  const {
    nfts,
    totalBalance,
    isPro,
    toggleFarming,
    collectTokens,
    buyPro,
    toggleAllFarming,
    updateNFTs,
    farmingSpeed,
    totalCollected,
    stats,
    showAnimation,
    walletBalance,
    tickets,
    lastOnlineTime
  } = useFarming();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const [collectButtonPressed, setCollectButtonPressed] = useState(false);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const [offlineTime, setOfflineTime] = useState(0);
  const [offlineEarned, setOfflineEarned] = useState(0);

  // Проверяем, есть ли NFT с завершенным циклом фарминга (12 часов)
  const completedNFTs = nfts.filter(nft => {
    if (!nft.isFarming || !nft.lastFarmTime) return false;
    const farmingTime = (Date.now() - nft.lastFarmTime) / (1000 * 60 * 60);
    return farmingTime >= 11.9 && farmingTime <= 12.1;
  });

  // Проверяем, есть ли NFT, которые можно запустить (не фармят)
  const nonFarmingNFTs = nfts.filter(nft => !nft.isFarming);
  const canStartFarming = nonFarmingNFTs.length > 0;

  // Функция для загрузки NFT
  const loadNFTs = async () => {
    if (!userAddress) return;
    
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

  // Эффект для анимации появления при загрузке
  useEffect(() => {
    setMounted(true);
  }, []);

  // Эффект для отображения уведомления о офлайн-фарминге
  useEffect(() => {
    if (!isConnected) return;
    
    // Получаем время последнего посещения из localStorage
    const savedLastOnline = localStorage.getItem(STORAGE_KEYS.LAST_ONLINE);
    if (!savedLastOnline) return;
    
    const now = Date.now();
    const lastOnlineTime = parseInt(savedLastOnline);
    const timeDiff = now - lastOnlineTime;
    
    // Если прошло более 5 минут, показываем уведомление
    if (timeDiff > 5 * 60 * 1000) {
      // Проверяем, есть ли фармящие NFT
      const savedFarmingState = localStorage.getItem(STORAGE_KEYS.FARMING_STATE);
      if (!savedFarmingState) return;
      
      try {
        const farmingState = JSON.parse(savedFarmingState);
        if (!farmingState.nfts || !Array.isArray(farmingState.nfts)) return;
        
        // Фильтруем NFT, которые находятся в процессе фарминга
        const farmingNFTs = farmingState.nfts.filter((nft: { isFarming: boolean; lastFarmTime?: number }) => nft.isFarming && nft.lastFarmTime);
        if (farmingNFTs.length === 0) return;
        
        // Рассчитываем заработанные токены
        const offlineMinutes = Math.floor(timeDiff / (1000 * 60));
        const offlineHours = timeDiff / (1000 * 60 * 60);
        
        // Получаем PRO статус
        const isPro = localStorage.getItem(STORAGE_KEYS.PRO_STATUS) === 'true';
        
        // Рассчитываем заработанные токены (максимум 12 часов на NFT)
        let totalEarned = 0;
        farmingNFTs.forEach((nft: { isFarming: boolean; lastFarmTime?: number }) => {
          if (!nft.lastFarmTime) return;
          
          const hoursFarmed = Math.min((now - nft.lastFarmTime) / (1000 * 60 * 60), 12);
          const earnedTokens = isPro ? hoursFarmed * 1.5 : hoursFarmed;
          totalEarned += parseFloat(earnedTokens.toFixed(2));
        });
        
        console.log(`Офлайн-фарминг: ${offlineMinutes} минут, заработано ${totalEarned.toFixed(2)} GIFT`);
        
        setOfflineTime(offlineMinutes);
        setOfflineEarned(totalEarned);
        setShowOfflineNotice(true);
        
        // Скрываем уведомление через 15 секунд
        const timer = setTimeout(() => {
          setShowOfflineNotice(false);
        }, 15000);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Ошибка при обработке данных офлайн-фарминга:', error);
      }
    }
  }, [isConnected]);

  // Эффект для проверки офлайн-фарминга при загрузке приложения
  useEffect(() => {
    if (!isConnected || !userAddress) return;
    
    // Проверяем, есть ли сохраненное состояние фарминга
    const checkOfflineFarming = async () => {
      const savedFarmingState = localStorage.getItem(STORAGE_KEYS.FARMING_STATE);
      if (!savedFarmingState) return;
      
      try {
        const farmingState = JSON.parse(savedFarmingState);
        if (!farmingState.nfts || !Array.isArray(farmingState.nfts)) return;
        
        // Фильтруем NFT, которые находятся в процессе фарминга
        const farmingNFTs = farmingState.nfts.filter((nft: { isFarming: boolean; lastFarmTime?: number }) => nft.isFarming && nft.lastFarmTime);
        
        // Если есть фармящие NFT, обновляем их состояние
        if (farmingNFTs.length > 0) {
          console.log(`🔄 Обновляем состояние ${farmingNFTs.length} фармящих NFT...`);
          
          // Проверяем, не было ли недавнего обновления NFT
          const lastNftUpdate = localStorage.getItem('last_nft_update_timestamp');
          const now = Date.now();
          
          if (lastNftUpdate) {
            const timeSinceLastUpdate = now - parseInt(lastNftUpdate);
            
            // Если прошло менее 1 минуты с последнего обновления, пропускаем
            if (timeSinceLastUpdate < 60000) {
              console.log('⏱️ Пропускаем обновление NFT - прошло менее 1 минуты с последнего обновления');
              return;
            }
          }
          
          // Обновляем время последнего обновления NFT
          localStorage.setItem('last_nft_update_timestamp', now.toString());
          
          // Загружаем актуальные NFT с сервера
          await loadNFTs();
        }
      } catch (error) {
        console.error('Ошибка при проверке офлайн-фарминга:', error);
      }
    };
    
    // Добавляем небольшую задержку перед проверкой офлайн-фарминга
    const timer = setTimeout(() => {
      checkOfflineFarming();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [isConnected, userAddress, loadNFTs]);

  useEffect(() => {
    if (isConnected && userAddress) {
      loadNFTs();
    } else {
      updateNFTs([]);
    }
  }, [isConnected, userAddress, updateNFTs]);

  const handleCollectTokens = () => {
    console.log('🖱️ Нажата кнопка "Собрать монеты"');
    console.log('💰 Текущий баланс для сбора:', totalBalance);
    
    if (totalBalance <= 0) {
      console.log('⚠️ Нет токенов для сбора, пропускаем...');
      return;
    }
    
    try {
      collectTokens();
      console.log('✅ Функция collectTokens() вызвана успешно');
      setCollectButtonPressed(true);
      setTimeout(() => setCollectButtonPressed(false), 1000);
    } catch (error) {
      console.error('❌ Ошибка при сборе токенов:', error);
    }
  };

  return (
    <main className="min-h-screen p-8 pb-24 bg-gradient-to-b from-black to-gray-900">
      {/* Декоративные элементы */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
      
      {/* Уведомление о офлайн-фарминге */}
      {showOfflineNotice && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500/90 to-yellow-600/90 px-4 py-3 rounded-[1.5rem] shadow-lg shadow-amber-500/20 border border-yellow-500/50 max-w-md w-full animate-slide-down">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-white">Фарминг продолжался офлайн!</h4>
              <p className="text-sm text-white/80">
                Пока вас не было ({offlineTime} {
                  offlineTime === 1 
                    ? t('minute') 
                    : offlineTime >= 2 && offlineTime <= 4 
                      ? t('minutes2to4') 
                      : t('minutes5plus')
                }), 
                {t('offlineFarmingDesc')} <span className="font-bold">{offlineEarned.toFixed(2)} GIFT</span>.
              </p>
            </div>
            <button 
              onClick={() => setShowOfflineNotice(false)}
              className="ml-auto w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <span className="text-white text-xs">×</span>
            </button>
          </div>
        </div>
      )}
      
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

        {isConnected && (
          <div className="absolute top-0 left-0 hidden md:flex items-center">
            <WalletBalance />
          </div>
        )}

        <h1 className={`text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50"></div>
            <GiftIcon className="w-8 h-8 text-white transform -rotate-12 relative z-10" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500/80 rounded-full animate-ping-slow"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
          </div>
          <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            GIFT FARM
          </span>
        </h1>

        {isTelegramReady && <TelegramUserInfo />}

        {isConnected ? (
          <div className={`bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-[3rem] p-8 border border-white/10 shadow-xl shadow-black/20 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                  <LightningIcon className="w-5 h-5 text-amber-400" /> {t('farmingTitle')}
                </h3>
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="relative w-full md:w-2/3">
                    
                    <div className="space-y-4 relative z-10 pl-2">
                      <div>
                        <p className="text-lg text-gray-300">{t('giftBalance')}</p>
                        <div className="flex items-baseline gap-3">
                          <p className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                            {totalBalance.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">
                          <span className="text-gray-400">{t('farmingSpeed')}:</span>
                          <span className="ml-2 font-medium text-white">{farmingSpeed.toFixed(1)} {t('perHour')}</span>
                          {isPro && (
                            <span className="ml-1 text-xs text-amber-400">(x1.5)</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">
                          <span className="text-gray-400">{t('tickets')}:</span>
                          <span className="ml-2 font-medium text-white">{tickets}</span>
                          <span className="ml-1 text-xs text-gray-400">{t('ticketsForFullCycle')}</span>
                        </p>
                      </div>
                    </div>
                    {showAnimation && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce text-white text-lg font-bold flex items-center gap-1 z-30">
                        <span>+</span>
                        <span className="bg-gradient-to-r from-amber-500/80 to-yellow-600/80 px-3 py-1 rounded-2xl shadow-lg shadow-amber-500/20">{totalCollected.toFixed(2)} GIFT</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 w-full md:w-1/3">
                    {!isPro && (
                      <button
                        onClick={buyPro}
                        className="px-6 py-4 rounded-[1.5rem] transition-all duration-300 bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white font-medium shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-1 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex items-center gap-2 relative z-10">
                          <StarIcon className="w-5 h-5 text-white" />
                          <span>{t('buyProTon')}</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-5 rounded-[1.5rem] text-center border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="w-12 h-12 mx-auto mb-2 bg-black/30 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-sm text-gray-400">{t('totalNFTs')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stats.totalNFTs}</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-5 rounded-[1.5rem] text-center border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="w-12 h-12 mx-auto mb-2 bg-black/30 rounded-full flex items-center justify-center">
                      <LightningIcon className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-sm text-gray-400">{t('farming')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stats.farmingNFTs}</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-5 rounded-[1.5rem] text-center border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="w-12 h-12 mx-auto mb-2 bg-black/30 rounded-full flex items-center justify-center">
                      <TicketIcon className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-sm text-gray-400">{t('readyToCollect')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{completedNFTs.length}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {isPro && (
                    <>
                      <button
                        onClick={toggleAllFarming}
                        disabled={!canStartFarming}
                        className={`flex-1 px-6 py-3 rounded-[1.5rem] text-sm shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
                          !canStartFarming
                            ? 'bg-gray-500/50 cursor-not-allowed text-gray-400'
                            : 'bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white hover:translate-y-[-2px] hover:shadow-amber-500/20'
                        }`}
                      >
                        <div className="absolute top-0 right-0 bg-amber-600/80 px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg text-[10px] font-bold flex items-center">
                          <CrownIcon className="w-2.5 h-2.5 mr-0.5" />
                          {t('proBadge')}
                        </div>
                        <LightningIcon className="w-5 h-5 text-white" />
                        <span>{t('startAll')} ({nonFarmingNFTs.length})</span>
                      </button>
                      
                      <button
                        onClick={handleCollectTokens}
                        disabled={totalBalance === 0}
                        className={`flex-1 px-6 py-3 rounded-[1.5rem] transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
                          totalBalance === 0
                            ? 'bg-gray-500/50 cursor-not-allowed text-gray-400 border-white/5'
                            : collectButtonPressed
                              ? 'bg-gradient-to-r from-green-500/80 to-green-600/80 text-white shadow-lg shadow-green-500/20'
                              : 'bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white shadow-lg hover:shadow-amber-500/20 transform hover:translate-y-[-2px]'
                        }`}
                      >
                        <div className="absolute top-0 right-0 bg-amber-600/80 px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg text-[10px] font-bold flex items-center">
                          <CrownIcon className="w-2.5 h-2.5 mr-0.5" />
                          {t('proBadge')}
                        </div>
                        {collectButtonPressed ? (
                          <CheckIcon className="w-5 h-5 text-white" />
                        ) : (
                          <CoinsIcon className="w-5 h-5 text-white" />
                        )}
                        <span>{collectButtonPressed ? t('collected') : t('collectCoins')}</span>
                      </button>
                    </>
                  )}
                  {!isPro && (
                    <button
                      onClick={buyPro}
                      className="w-full bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white px-6 py-3 rounded-[1.5rem] text-sm shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <CrownIcon className="w-5 h-5 text-white" />
                      <span>{t('getProForFarming')}</span>
                    </button>
                  )}
                </div>

                {completedNFTs.length > 0 && (
                  <div className="mt-4 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 p-4 rounded-[1.5rem] border border-amber-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <TicketIcon className="w-5 h-5 text-amber-400 animate-pulse" />
                      <p className="text-amber-300 font-medium">
                        {t('nftCompleted')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      {t('collectFarmNowDesc')}
                    </p>
                    <button
                      onClick={handleCollectTokens}
                      className="w-full bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white px-4 py-2 rounded-[1rem] text-sm border border-yellow-500/50 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <TicketIcon className="w-5 h-5 text-white" />
                      <span>{t('collectFarmAndTickets')}</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-400" /> {t('yourNFTs')}
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={loadNFTs}
                      disabled={isLoading}
                      className={`bg-gradient-to-r from-black/50 to-gray-900/50 hover:from-black/60 hover:to-gray-800/60 text-white px-4 py-2 rounded-[1.5rem] text-sm border border-white/10 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/5 flex items-center gap-2 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? (
                        <LoadingIcon className="w-4 h-4 text-amber-400" />
                      ) : (
                        <RefreshIcon className="w-4 h-4 text-amber-400" />
                      )}
                      <span>{isLoading ? t('loading') : t('updateList')}</span>
                    </button>
                  </div>
                </div>
                <NFTGrid 
                  nfts={nfts} 
                  onToggleFarming={toggleFarming} 
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={`bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-[3rem] p-8 border border-white/10 shadow-xl shadow-black/20 text-center transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-amber-500/20 relative overflow-hidden mb-6">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50"></div>
              <GiftIcon className="w-10 h-10 text-white transform -rotate-12 relative z-10" />
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

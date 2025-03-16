import { useState, useEffect, useCallback } from 'react';
import { NFTItem, calculateTokens } from '../utils/nft';
import { useTonConnect } from './useTonConnect';
import { toNano } from '@ton/core';
import { loadReferralData, saveReferralData, checkAndSaveReferrer } from '../utils/referrals';

// Функция для расчета общего времени фарминга всех NFT
const calculateTotalHoursFarmed = (nfts: NFTItem[]): number => {
  if (!nfts || nfts.length === 0) return 0;
  
  const now = Date.now();
  return nfts.reduce((total, nft) => {
    if (!nft.isFarming || !nft.lastFarmTime) return total;
    
    // Рассчитываем время фарминга (максимум 12 часов)
    const hoursFarmed = Math.min((now - nft.lastFarmTime) / (1000 * 60 * 60), 12);
    return total + hoursFarmed;
  }, 0);
};

interface FarmingState {
  nfts: NFTItem[];
  totalBalance: number;
  isPro: boolean;
  farmingSpeed: number; // Токенов в час
  totalCollected: number;
  showAnimation: boolean;
  proExpiresAt?: number; // Timestamp когда истекает PRO
  walletBalance: number; // Добавляем баланс кошелька
  tickets: number; // Количество билетиков
  lastOnlineTime?: number; // Время последнего посещения приложения
  stats: {
    totalNFTs: number;
    farmingNFTs: number;
    totalHoursFarmed: number;
  };
}

export const STORAGE_KEYS = {
  WALLET_BALANCE: 'gift_wallet_balance',
  PRO_STATUS: 'gift_pro_status',
  PRO_EXPIRES: 'gift_pro_expires',
  FARMING_STATE: 'gift_farming_state',
  TICKETS: 'gift_tickets', // Ключ для хранения билетиков
  LAST_ONLINE: 'gift_last_online', // Ключ для хранения времени последнего посещения
};

export function useFarming() {
  const { sender, tonConnectUI, isConnected, userAddress } = useTonConnect();
  const [state, setState] = useState<FarmingState>(() => {
    if (typeof window === 'undefined') return {
      nfts: [],
      totalBalance: 0,
      isPro: false,
      farmingSpeed: 0,
      totalCollected: 0,
      showAnimation: false,
      walletBalance: 0,
      tickets: 0, // Инициализируем билетики
      stats: {
        totalNFTs: 0,
        farmingNFTs: 0,
        totalHoursFarmed: 0,
      },
    };

    // Загружаем сохраненные данные при инициализации
    const savedBalance = localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE);
    const savedProStatus = localStorage.getItem(STORAGE_KEYS.PRO_STATUS);
    const savedProExpires = localStorage.getItem(STORAGE_KEYS.PRO_EXPIRES);
    const savedFarmingState = localStorage.getItem(STORAGE_KEYS.FARMING_STATE);
    const savedTickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
    const savedLastOnline = localStorage.getItem(STORAGE_KEYS.LAST_ONLINE);

    return {
      nfts: [],
      totalBalance: 0,
      isPro: savedProStatus === 'true',
      farmingSpeed: 0,
      totalCollected: 0,
      showAnimation: false,
      walletBalance: savedBalance ? parseFloat(savedBalance) : 0,
      proExpiresAt: savedProExpires ? parseInt(savedProExpires) : undefined,
      tickets: savedTickets ? parseInt(savedTickets) : 0, // Загружаем сохраненные билетики
      lastOnlineTime: savedLastOnline ? parseInt(savedLastOnline) : undefined,
      stats: {
        totalNFTs: 0,
        farmingNFTs: 0,
        totalHoursFarmed: 0,
      },
    };
  });

  // Обработка офлайн-фарминга при загрузке приложения
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Получаем время последнего посещения
    const savedLastOnline = localStorage.getItem(STORAGE_KEYS.LAST_ONLINE);
    if (!savedLastOnline) {
      // Если это первое посещение, просто сохраняем текущее время
      localStorage.setItem(STORAGE_KEYS.LAST_ONLINE, Date.now().toString());
      return;
    }

    const now = Date.now();
    const lastOnlineTime = parseInt(savedLastOnline);
    const offlineTime = now - lastOnlineTime;
    
    // Если прошло менее 1 секунды, считаем что это обновление страницы
    if (offlineTime < 1000) return;
    
    console.log(`🕒 Пользователь был офлайн ${(offlineTime / (1000 * 60)).toFixed(2)} минут`);
    
    // Обновляем время последнего посещения
    localStorage.setItem(STORAGE_KEYS.LAST_ONLINE, now.toString());
    
    // Загружаем сохраненное состояние фарминга
    const savedFarmingState = localStorage.getItem(STORAGE_KEYS.FARMING_STATE);
    if (!savedFarmingState) return;
    
    try {
      const farmingState = JSON.parse(savedFarmingState);
      if (!farmingState.nfts || !Array.isArray(farmingState.nfts)) return;
      
      // Фильтруем NFT, которые находятся в процессе фарминга
      const farmingNFTs = farmingState.nfts.filter((nft: { isFarming: boolean; lastFarmTime?: number }) => nft.isFarming && nft.lastFarmTime);
      if (farmingNFTs.length === 0) return;
      
      console.log(`📊 Найдено ${farmingNFTs.length} NFT в процессе фарминга`);
      
      // Рассчитываем накопленные токены для каждого NFT
      let totalOfflineEarned = 0;
      let completedNFTsCount = 0;
      
      const updatedNFTs = farmingState.nfts.map((nft: { id: string; isFarming: boolean; lastFarmTime?: number; collectedTokens?: number }) => {
        if (!nft.isFarming || !nft.lastFarmTime) return nft;
        
        // Рассчитываем, сколько часов прошло с момента начала фарминга
        const hoursFarmed = (now - nft.lastFarmTime) / (1000 * 60 * 60);
        
        // Проверяем, завершился ли полный цикл фарминга (12 часов)
        const isCompleted = hoursFarmed >= 12;
        if (isCompleted) completedNFTsCount++;
        
        // Рассчитываем накопленные токены (максимум 12 часов)
        const isPro = localStorage.getItem(STORAGE_KEYS.PRO_STATUS) === 'true';
        const maxHours = Math.min(hoursFarmed, 12);
        const tokens = parseFloat((isPro ? maxHours * 1.5 : maxHours).toFixed(2));
        
        totalOfflineEarned += tokens;
        
        return {
          ...nft,
          collectedTokens: tokens
        };
      });
      
      console.log(`💰 Заработано офлайн: ${totalOfflineEarned.toFixed(2)} GIFT`);
      
      if (completedNFTsCount > 0) {
        console.log(`✅ ${completedNFTsCount} NFT завершили полный цикл фарминга во время офлайна!`);
      }
      
      // Обновляем состояние фарминга в localStorage
      const updatedFarmingState = {
        ...farmingState,
        nfts: updatedNFTs,
        totalBalance: totalOfflineEarned,
        totalNFTs: updatedNFTs.length,
        farmingNFTs: updatedNFTs.filter((nft: { isFarming: boolean }) => nft.isFarming).length,
        totalHoursFarmed: calculateTotalHoursFarmed(updatedNFTs),
        isPro: localStorage.getItem(STORAGE_KEYS.PRO_STATUS) === 'true'
      };
      
      localStorage.setItem(STORAGE_KEYS.FARMING_STATE, JSON.stringify(updatedFarmingState));
      
      // Обновляем состояние в React
      setState(prevState => ({
        ...prevState,
        nfts: updatedNFTs,
        totalBalance: totalOfflineEarned,
        stats: {
          ...prevState.stats,
          totalNFTs: updatedNFTs.length,
          farmingNFTs: updatedNFTs.filter((nft: { isFarming: boolean }) => nft.isFarming).length,
          totalHoursFarmed: calculateTotalHoursFarmed(updatedNFTs)
        }
      }));
    } catch (error) {
      console.error('Ошибка при обработке офлайн-фарминга:', error);
    }
  }, []);

  // Сохраняем время последнего посещения при каждом рендере и перед закрытием страницы
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const now = Date.now();
    localStorage.setItem(STORAGE_KEYS.LAST_ONLINE, now.toString());
    
    // Устанавливаем обработчик на событие перед закрытием страницы
    const handleBeforeUnload = () => {
      localStorage.setItem(STORAGE_KEYS.LAST_ONLINE, Date.now().toString());
    };
    
    // Устанавливаем обработчик на событие видимости страницы
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        localStorage.setItem(STORAGE_KEYS.LAST_ONLINE, Date.now().toString());
      } else {
        // При возвращении на страницу обновляем время
        const lastOnline = localStorage.getItem(STORAGE_KEYS.LAST_ONLINE);
        if (lastOnline) {
          const offlineTime = Date.now() - parseInt(lastOnline);
          if (offlineTime > 5000) { // Если прошло более 5 секунд
            // Обновляем состояние без перезагрузки страницы
            const savedFarmingState = localStorage.getItem(STORAGE_KEYS.FARMING_STATE);
            if (savedFarmingState) {
              try {
                const farmingState = JSON.parse(savedFarmingState);
                if (farmingState.nfts && Array.isArray(farmingState.nfts)) {
                  // Обновляем состояние NFT с учетом офлайн-времени
                  const now = Date.now();
                  const updatedNFTs = farmingState.nfts.map((nft: { id: string; isFarming: boolean; lastFarmTime?: number; collectedTokens?: number }) => {
                    if (!nft.isFarming || !nft.lastFarmTime) return nft;
                    
                    // Рассчитываем, сколько часов прошло с момента начала фарминга
                    const hoursFarmed = (now - nft.lastFarmTime) / (1000 * 60 * 60);
                    
                    // Рассчитываем накопленные токены (максимум 12 часов)
                    const isPro = localStorage.getItem(STORAGE_KEYS.PRO_STATUS) === 'true';
                    const maxHours = Math.min(hoursFarmed, 12);
                    const tokens = parseFloat((isPro ? maxHours * 1.5 : maxHours).toFixed(2));
                    
                    return {
                      ...nft,
                      collectedTokens: tokens
                    };
                  });
                  
                  // Рассчитываем общий баланс
                  let totalBalance = 0;
                  updatedNFTs.forEach((nft: { isFarming: boolean; collectedTokens?: number }) => {
                    if (nft.isFarming && nft.collectedTokens) {
                      totalBalance += nft.collectedTokens;
                    }
                  });
                  
                  // Обновляем состояние фарминга в localStorage
                  const updatedFarmingState = {
                    ...farmingState,
                    nfts: updatedNFTs,
                    totalBalance
                  };
                  
                  localStorage.setItem(STORAGE_KEYS.FARMING_STATE, JSON.stringify(updatedFarmingState));
                  
                  // Обновляем состояние в React без перезагрузки
                  setState(prevState => ({
                    ...prevState,
                    nfts: updatedNFTs,
                    totalBalance,
                    lastOnlineTime: now,
                    stats: {
                      ...prevState.stats,
                      totalNFTs: updatedNFTs.length,
                      farmingNFTs: updatedNFTs.filter((nft: { isFarming: boolean }) => nft.isFarming).length,
                      totalHoursFarmed: calculateTotalHoursFarmed(updatedNFTs)
                    }
                  }));
                }
              } catch (error) {
                console.error('Ошибка при обработке данных офлайн-фарминга:', error);
              }
            }
          }
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Сохраняем состояние фарминга при изменении
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Сохраняем текущее время как время последнего онлайна
    localStorage.setItem(STORAGE_KEYS.LAST_ONLINE, Date.now().toString());
    
    const farmingState = {
      nfts: state.nfts.map(nft => ({
        id: nft.id,
        isFarming: nft.isFarming,
        lastFarmTime: nft.lastFarmTime,
        collectedTokens: nft.collectedTokens
      })),
      walletBalance: state.walletBalance,
      totalBalance: state.totalBalance,
      totalNFTs: state.stats.totalNFTs,
      farmingNFTs: state.stats.farmingNFTs,
      totalHoursFarmed: state.stats.totalHoursFarmed,
      isPro: state.isPro
    };
    
    localStorage.setItem(STORAGE_KEYS.FARMING_STATE, JSON.stringify(farmingState));
  }, [state.nfts, state.walletBalance, state.totalBalance, state.stats, state.isPro]);

  // Сохраняем баланс при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLET_BALANCE, state.walletBalance.toString());
  }, [state.walletBalance]);

  // Сохраняем PRO статус при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRO_STATUS, state.isPro.toString());
    if (state.proExpiresAt) {
      localStorage.setItem(STORAGE_KEYS.PRO_EXPIRES, state.proExpiresAt.toString());
    } else {
      localStorage.removeItem(STORAGE_KEYS.PRO_EXPIRES);
    }
  }, [state.isPro, state.proExpiresAt]);

  // Проверяем не истекла ли подписка
  useEffect(() => {
    const checkProStatus = () => {
      if (state.proExpiresAt && Date.now() > state.proExpiresAt) {
        setState(prev => ({ ...prev, isPro: false, proExpiresAt: undefined }));
      }
    };

    const interval = setInterval(checkProStatus, 1000);
    return () => clearInterval(interval);
  }, [state.proExpiresAt]);

  // Обновление баланса каждые 2 секунды
  useEffect(() => {
    const updateBalance = () => {
      setState(prevState => {
        const farmingNFTs = prevState.nfts.filter(nft => nft.isFarming);
        let totalBalance = 0;
        let farmingSpeed = 0;
        let totalHoursFarmed = 0;

        farmingNFTs.forEach(nft => {
          // Получаем точное значение токенов с округлением до 2 знаков
          const tokens = parseFloat(calculateTokens(nft, prevState.isPro).toFixed(2));
          totalBalance += tokens;
          
          if (nft.lastFarmTime) {
            const hoursFarmed = (Date.now() - nft.lastFarmTime) / (1000 * 60 * 60);
            if (hoursFarmed < 12) {
              farmingSpeed += prevState.isPro ? 1.5 : 1;
            }
            totalHoursFarmed += Math.min(hoursFarmed, 12);
          }
        });

        // Округляем общий баланс до 2 знаков для стабильности отображения
        totalBalance = parseFloat(totalBalance.toFixed(2));

        return {
          ...prevState,
          totalBalance,
          farmingSpeed,
          stats: {
            ...prevState.stats,
            farmingNFTs: farmingNFTs.length,
            totalHoursFarmed
          }
        };
      });
    };

    const interval = setInterval(updateBalance, 2000);
    return () => clearInterval(interval);
  }, []);

  // Обновление списка NFT
  const updateNFTs = useCallback((newNFTs: NFTItem[]) => {
    // Проверяем, не было ли недавнего обновления NFT
    if (typeof window !== 'undefined') {
      const lastNftUpdate = localStorage.getItem('last_nft_update_timestamp');
      const now = Date.now();
      
      if (lastNftUpdate) {
        const timeSinceLastUpdate = now - parseInt(lastNftUpdate);
        
        // Если прошло менее 5 секунд с последнего обновления, пропускаем
        if (timeSinceLastUpdate < 5000 && newNFTs.length === 0) {
          console.log('⏱️ Пропускаем обновление NFT - прошло менее 5 секунд с последнего обновления');
          return;
        }
      }
      
      // Обновляем время последнего обновления NFT
      localStorage.setItem('last_nft_update_timestamp', now.toString());
    }
    
    setState(prevState => {
      // Загружаем сохраненное состояние фарминга
      const savedFarmingState = localStorage.getItem(STORAGE_KEYS.FARMING_STATE);
      const farmingState = savedFarmingState ? JSON.parse(savedFarmingState) : null;

      // Если нет новых NFT, но есть сохраненное состояние, используем его
      if (newNFTs.length === 0 && farmingState && farmingState.nfts && farmingState.nfts.length > 0) {
        console.log('📦 Используем сохраненное состояние фарминга вместо пустого списка NFT');
        
        // Рассчитываем общий баланс
        let totalBalance = 0;
        farmingState.nfts.forEach((nft: { isFarming: boolean; collectedTokens?: number }) => {
          if (nft.isFarming && nft.collectedTokens) {
            totalBalance += nft.collectedTokens;
          }
        });
        
        return {
          ...prevState,
          nfts: farmingState.nfts,
          totalBalance,
          stats: {
            ...prevState.stats,
            totalNFTs: farmingState.nfts.length,
            farmingNFTs: farmingState.nfts.filter((nft: { isFarming: boolean }) => nft.isFarming).length
          }
        };
      }

      // Обновляем NFT с сохраненным состоянием фарминга
      const updatedNFTs = newNFTs.map(nft => {
        const savedNFT = farmingState?.nfts?.find((saved: { id: string }) => saved.id === nft.id);
        if (savedNFT) {
          // Если NFT находится в процессе фарминга, рассчитываем накопленные токены
          if (savedNFT.isFarming && savedNFT.lastFarmTime) {
            const now = Date.now();
            const hoursFarmed = (now - savedNFT.lastFarmTime) / (1000 * 60 * 60);
            const maxHours = Math.min(hoursFarmed, 12);
            const tokens = parseFloat((prevState.isPro ? maxHours * 1.5 : maxHours).toFixed(2));
            
            return {
              ...nft,
              isFarming: savedNFT.isFarming,
              lastFarmTime: savedNFT.lastFarmTime,
              collectedTokens: tokens
            };
          }
          
          return {
            ...nft,
            isFarming: savedNFT.isFarming,
            lastFarmTime: savedNFT.lastFarmTime,
            collectedTokens: savedNFT.collectedTokens
          };
        }
        return nft;
      });

      // Рассчитываем общий баланс
      let totalBalance = 0;
      updatedNFTs.forEach(nft => {
        if (nft.isFarming && nft.collectedTokens) {
          totalBalance += nft.collectedTokens;
        }
      });

      return {
        ...prevState,
        nfts: updatedNFTs,
        totalBalance,
        stats: {
          ...prevState.stats,
          totalNFTs: updatedNFTs.length,
          farmingNFTs: updatedNFTs.filter(nft => nft.isFarming).length,
          totalHoursFarmed: calculateTotalHoursFarmed(updatedNFTs)
        }
      };
    });
  }, []);

  // Переключение фарминга для одного NFT
  const toggleFarming = useCallback((id: string) => {
    console.log(`🔄 Переключаем фарминг для NFT с ID: ${id}`);
    
    setState(prevState => {
      // Находим NFT по ID
      const nft = prevState.nfts.find(nft => nft.id === id);
      
      if (!nft) {
        console.log(`⚠️ NFT с ID ${id} не найден, пропускаем...`);
        return prevState; // Возвращаем текущее состояние без изменений
      }
      
      console.log(`${nft.isFarming ? '⏹️ Останавливаем' : '▶️ Запускаем'} фарминг для NFT: ${nft.metadata?.name || id}`);
      
      const updatedNFTs = prevState.nfts.map(nft =>
        nft.id === id
          ? {
              ...nft,
              isFarming: !nft.isFarming,
              lastFarmTime: !nft.isFarming ? Date.now() : undefined,
              collectedTokens: 0
            }
          : nft
      );
      
      const updatedState = {
        ...prevState,
        nfts: updatedNFTs,
        stats: {
          ...prevState.stats,
          farmingNFTs: updatedNFTs.filter(nft => nft.isFarming).length,
          totalHoursFarmed: calculateTotalHoursFarmed(updatedNFTs)
        }
      };
      
      // Сохраняем обновленное состояние в localStorage
      try {
        console.log('💾 Сохраняем данные в localStorage...');
        const farmingState = {
          nfts: updatedNFTs,
          totalBalance: updatedState.totalBalance,
          walletBalance: updatedState.walletBalance,
          totalNFTs: updatedNFTs.length,
          farmingNFTs: updatedNFTs.filter(nft => nft.isFarming).length,
          totalHoursFarmed: calculateTotalHoursFarmed(updatedNFTs),
          isPro: updatedState.isPro,
          proExpiresAt: updatedState.proExpiresAt,
          tickets: updatedState.tickets,
          lastOnlineTime: updatedState.lastOnlineTime
        };
        
        localStorage.setItem(STORAGE_KEYS.FARMING_STATE, JSON.stringify(farmingState));
        console.log('✅ Данные успешно сохранены в localStorage');
      } catch (error) {
        console.error('❌ Ошибка при сохранении данных в localStorage:', error);
      }
      
      console.log('✅ Переключение фарминга завершено успешно');
      
      return updatedState;
    });
  }, []);

  // Проверяем реферальный код при подключении кошелька
  useEffect(() => {
    if (isConnected && userAddress) {
      // Проверяем и сохраняем реферрера, если пользователь перешел по реферальной ссылке
      checkAndSaveReferrer(userAddress);
    }
  }, [isConnected, userAddress]);

  // Сохраняем количество билетиков при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, state.tickets.toString());
  }, [state.tickets]);

  // Сбор всех накопленных токенов
  const collectTokens = useCallback(() => {
    console.log('🔄 Начинаем сбор токенов...');
    
    // Проверяем текущее состояние перед обновлением
    const currentState = JSON.parse(localStorage.getItem(STORAGE_KEYS.FARMING_STATE) || '{}');
    console.log('📊 Текущее состояние из localStorage:', currentState);
    
    setState(prevState => {
      // Проверяем, есть ли токены для сбора
      if (prevState.totalBalance <= 0) {
        console.log('⚠️ Нет токенов для сбора, пропускаем...');
        return prevState; // Возвращаем текущее состояние без изменений
      }
      
      // Используем точно то же значение, которое отображается в интерфейсе
      const collectedAmount = parseFloat(prevState.totalBalance.toFixed(2));
      console.log('💰 Собираем токены:', collectedAmount);
      
      const newWalletBalance = prevState.walletBalance + collectedAmount;
      console.log('💼 Новый баланс кошелька:', newWalletBalance);
      
      let newTickets = prevState.tickets;

      // Проверяем, есть ли NFT, которые завершили полный цикл фарминга (12 часов)
      const completedNFTs = prevState.nfts.filter(nft => {
        if (!nft.isFarming || !nft.lastFarmTime) return false;
        const farmingTime = (Date.now() - nft.lastFarmTime) / (1000 * 60 * 60);
        // Проверяем, что прошло более 11.9 часов (небольшой запас для погрешности)
        return farmingTime >= 11.9;
      });

      // Добавляем по 1 билетику за каждый NFT, завершивший полный цикл
      if (completedNFTs.length > 0) {
        newTickets += completedNFTs.length;
        console.log(`🎟️ Получено ${completedNFTs.length} билетиков за полный цикл фарминга!`);
      }

      // Если пользователь подключен, добавляем 5% от собранных токенов реферреру
      if (isConnected && userAddress && collectedAmount > 0) {
        try {
          const referralData = loadReferralData(userAddress);
          
          // Если у пользователя есть реферрер, добавляем ему 5% от собранных токенов
          if (referralData.referrer) {
            const referrerData = loadReferralData(referralData.referrer);
            const referralBonus = collectedAmount * 0.05; // 5% от собранных токенов
            
            referrerData.totalEarned += referralBonus;
            saveReferralData(referrerData);
          }
        } catch (error) {
          console.error('Ошибка при начислении реферального бонуса:', error);
        }
      }

      // Останавливаем фарминг на всех NFT и сбрасываем их состояние
      const updatedNFTs = prevState.nfts.map(nft => ({
        ...nft,
        isFarming: false, // Останавливаем фарминг
        lastFarmTime: undefined, // Сбрасываем время последнего фарма
        collectedTokens: 0 // Сбрасываем накопленные токены
      }));

      // Сохраняем обновленное состояние фарминга
      const farmingState = {
        nfts: updatedNFTs,
        walletBalance: newWalletBalance,
        totalBalance: 0,
        totalNFTs: updatedNFTs.length,
        farmingNFTs: 0,
        totalHoursFarmed: 0,
        isPro: prevState.isPro,
        proExpiresAt: prevState.proExpiresAt,
        tickets: newTickets,
        lastOnlineTime: prevState.lastOnlineTime
      };

      // Сохраняем все данные в localStorage
      try {
        console.log('💾 Сохраняем данные в localStorage...');
        localStorage.setItem(STORAGE_KEYS.FARMING_STATE, JSON.stringify(farmingState));
        localStorage.setItem(STORAGE_KEYS.WALLET_BALANCE, newWalletBalance.toString());
        localStorage.setItem(STORAGE_KEYS.TICKETS, newTickets.toString());
        console.log('✅ Данные успешно сохранены в localStorage');
      } catch (error) {
        console.error('❌ Ошибка при сохранении данных в localStorage:', error);
      }

      console.log('✅ Сбор токенов завершен успешно');
      
      return {
        ...prevState,
        nfts: updatedNFTs,
        totalBalance: 0,
        walletBalance: newWalletBalance,
        totalCollected: prevState.totalCollected + collectedAmount,
        tickets: newTickets,
        showAnimation: true,
        stats: {
          ...prevState.stats,
          totalNFTs: updatedNFTs.length,
          farmingNFTs: 0,
          totalHoursFarmed: 0
        }
      };
    });

    setTimeout(() => {
      setState(prev => ({ ...prev, showAnimation: false }));
    }, 2000);
  }, [isConnected, userAddress]);

  // Покупка PRO подписки
  const buyPro = useCallback(async () => {
    if (!tonConnectUI) return;

    try {
      // Создаем транзакцию на 0.1 TON
      await tonConnectUI.sendTransaction({
        messages: [
          {
            address: 'UQAHmegvebyyP9bVXc-H1unVw9UrUZyPD15jB6PfYVM-ZcvJ', // Адрес кошелька для оплаты
            amount: toNano('0.1').toString(),
          },
        ],
        validUntil: Date.now() + 5 * 60 * 1000, // 5 минут на подтверждение
      });

      // После успешной транзакции активируем PRO на 7 дней
      setState(prev => ({
        ...prev,
        isPro: true,
        proExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 дней в миллисекундах
      }));
    } catch (error) {
      console.error('Error buying PRO:', error);
    }
  }, [tonConnectUI]);

  // Запуск фарминга для всех NFT
  const toggleAllFarming = useCallback(() => {
    console.log('🔄 Запускаем фарминг для всех NFT...');
    
    setState(prevState => {
      // Проверяем, есть ли NFT, которые не фармят
      const nonFarmingNFTs = prevState.nfts.filter(nft => !nft.isFarming);
      
      if (nonFarmingNFTs.length === 0) {
        console.log('⚠️ Нет NFT для запуска фарминга, пропускаем...');
        return prevState; // Возвращаем текущее состояние без изменений
      }
      
      console.log(`🚀 Запускаем фарминг для ${nonFarmingNFTs.length} NFT...`);
      
      const updatedNFTs = prevState.nfts.map(nft => {
        // Если NFT уже фармит, оставляем его без изменений
        if (nft.isFarming) return nft;
        
        // Иначе запускаем фарминг
        return {
          ...nft,
          isFarming: true,
          lastFarmTime: Date.now(),
          collectedTokens: 0
        };
      });
      
      const updatedState = {
        ...prevState,
        nfts: updatedNFTs,
        stats: {
          ...prevState.stats,
          farmingNFTs: updatedNFTs.filter(nft => nft.isFarming).length,
          totalHoursFarmed: calculateTotalHoursFarmed(updatedNFTs)
        }
      };
      
      // Сохраняем обновленное состояние в localStorage
      try {
        console.log('💾 Сохраняем данные в localStorage...');
        const farmingState = {
          nfts: updatedNFTs,
          totalBalance: updatedState.totalBalance,
          walletBalance: updatedState.walletBalance,
          totalNFTs: updatedNFTs.length,
          farmingNFTs: updatedNFTs.filter(nft => nft.isFarming).length,
          totalHoursFarmed: calculateTotalHoursFarmed(updatedNFTs),
          isPro: updatedState.isPro,
          proExpiresAt: updatedState.proExpiresAt,
          tickets: updatedState.tickets,
          lastOnlineTime: updatedState.lastOnlineTime
        };
        
        localStorage.setItem(STORAGE_KEYS.FARMING_STATE, JSON.stringify(farmingState));
        console.log('✅ Данные успешно сохранены в localStorage');
      } catch (error) {
        console.error('❌ Ошибка при сохранении данных в localStorage:', error);
      }
      
      console.log('✅ Запуск фарминга завершен успешно');
      
      return updatedState;
    });
  }, []);

  return {
    ...state,
    updateNFTs,
    toggleFarming,
    collectTokens,
    buyPro,
    toggleAllFarming
  };
} 
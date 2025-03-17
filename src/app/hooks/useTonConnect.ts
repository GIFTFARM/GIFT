import { useEffect, useState, useCallback } from 'react';
import { TonConnectUI } from '@tonconnect/ui';
import { checkAndSaveReferrer } from '../utils/referrals';

// Создаем глобальную переменную для хранения экземпляра TonConnectUI
let tonConnectUI: TonConnectUI | null = null;

const STORAGE_KEYS = {
  WALLET_BALANCE: 'gift_wallet_balance',
  PRO_STATUS: 'gift_pro_status',
  TICKETS: 'gift_tickets',
  GIFT_BALANCE: 'gift_balance',
};

export function useTonConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [ui, setUI] = useState<TonConnectUI | null>(null);
  const [isReferralChecked, setIsReferralChecked] = useState(false);
  const [walletBalance, setWalletBalance] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedBalance = localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE);
      return savedBalance ? parseFloat(savedBalance) : 0;
    }
    return 0;
  });
  const [isPro, setIsPro] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.PRO_STATUS) === 'true';
    }
    return false;
  });
  const [tickets, setTickets] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
      return savedTickets ? parseInt(savedTickets) : 10;
    }
    return 10;
  });
  const [giftBalance, setGiftBalanceState] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedBalance = localStorage.getItem(STORAGE_KEYS.GIFT_BALANCE);
      return savedBalance ? parseFloat(savedBalance) : 0;
    }
    return 0;
  });

  // Инициализация TonConnectUI только на клиенте
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const initTonConnect = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        if (!tonConnectUI) {
          tonConnectUI = new TonConnectUI({
            manifestUrl: 'http://localhost:3000/tonconnect-manifest.json',
            buttonRootId: 'connect-wallet',
          });
        }
        
        setUI(tonConnectUI);
        
        // Проверяем текущее состояние подключения
        const wallet = tonConnectUI.wallet;
        setIsConnected(!!wallet);
        setUserAddress(wallet?.account.address || null);
        
        // Подписываемся на изменения состояния
        unsubscribe = tonConnectUI.onStatusChange(wallet => {
          setIsConnected(!!wallet);
          setUserAddress(wallet?.account.address || null);
        });
      } catch (error) {
        console.error('Error initializing TonConnect:', error);
      }
    };
    
    initTonConnect();
    
    // Очистка при размонтировании
    return () => {
      try {
        if (unsubscribe) {
          unsubscribe();
        }
      } catch (error) {
        console.error('Error unsubscribing from TonConnect:', error);
      }
    };
  }, []);

  // Проверка реферального кода при подключении кошелька
  useEffect(() => {
    if (isConnected && userAddress && !isReferralChecked) {
      try {
        // Проверяем URL на наличие реферального кода
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');
        
        if (refCode) {
          // Сохраняем реферальный код в localStorage
          localStorage.setItem('gift_referral_code', refCode);
        }
        
        // Проверяем и сохраняем реферера
        checkAndSaveReferrer(userAddress);
        setIsReferralChecked(true);
      } catch (error) {
        console.error('Ошибка при проверке реферального кода:', error);
      }
    }
  }, [isConnected, userAddress, isReferralChecked]);

  // Обновляем состояние при изменении localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = () => {
      const savedBalance = localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE);
      const savedProStatus = localStorage.getItem(STORAGE_KEYS.PRO_STATUS);
      
      setWalletBalance(savedBalance ? parseFloat(savedBalance) : 0);
      setIsPro(savedProStatus === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const disconnect = async () => {
    try {
      if (ui) {
        await ui.disconnect();
        setIsReferralChecked(false);
      }
    } catch (error) {
      console.error('Error disconnecting from TonConnect:', error);
    }
  };

  // Функция для обновления баланса GIFT
  const setGiftBalance = useCallback((updater: (prev: number) => number) => {
    if (typeof window === 'undefined') return;
    
    // Получаем текущий баланс
    const currentBalance = Number(localStorage.getItem(STORAGE_KEYS.GIFT_BALANCE) || 0);
    
    // Вычисляем новый баланс
    const newBalance = updater(currentBalance);
    
    // Сохраняем в localStorage
    localStorage.setItem(STORAGE_KEYS.GIFT_BALANCE, newBalance.toString());
    
    // Обновляем состояние React
    setGiftBalanceState(newBalance);
  }, []);

  // Функция для уменьшения количества билетиков
  const useTicket = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    // Проверяем, есть ли билетики
    if (tickets <= 0) return false;
    
    // Уменьшаем количество билетиков
    const newTickets = tickets - 1;
    
    // Сохраняем в localStorage
    localStorage.setItem(STORAGE_KEYS.TICKETS, newTickets.toString());
    
    // Обновляем состояние React
    setTickets(newTickets);
    
    return true;
  }, [tickets]);

  return {
    isConnected,
    userAddress,
    sender: ui?.wallet,
    tonConnectUI: ui,
    walletBalance,
    isPro,
    tickets,
    giftBalance,
    disconnect,
    setGiftBalance,
    useTicket,
  };
} 
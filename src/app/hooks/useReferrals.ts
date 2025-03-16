import { useState, useEffect } from 'react';
import { useTonConnect } from './useTonConnect';
import { 
  ReferralData, 
  loadReferralData, 
  saveReferralData, 
  getReferralLink,
  generateReferralCode
} from '../utils/referrals';

export function useReferrals() {
  const { isConnected, userAddress } = useTonConnect();
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: '',
    referrals: [],
    totalEarned: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка реферальных данных
  useEffect(() => {
    if (!isConnected || !userAddress) {
      setReferralData({
        referralCode: '',
        referrals: [],
        totalEarned: 0
      });
      setIsLoading(false);
      return;
    }

    try {
      const data = loadReferralData(userAddress);
      
      // Если код не был сгенерирован, генерируем его
      if (!data.referralCode) {
        data.referralCode = generateReferralCode(userAddress);
        saveReferralData(data);
      }
      
      setReferralData(data);
    } catch (error) {
      console.error('Ошибка загрузки реферальных данных:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, userAddress]);

  // Получение реферальной ссылки
  const referralLink = getReferralLink(referralData.referralCode);

  // Копирование реферальной ссылки в буфер обмена
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      return true;
    } catch (error) {
      console.error('Ошибка копирования ссылки:', error);
      return false;
    }
  };

  // Добавление бонусных токенов за рефералов
  const claimReferralBonus = () => {
    if (!isConnected || !userAddress) return false;
    
    try {
      // Получаем текущий баланс из localStorage
      const walletBalanceStr = localStorage.getItem('gift_wallet_balance');
      const currentBalance = walletBalanceStr ? parseFloat(walletBalanceStr) : 0;
      
      // Добавляем бонус к балансу
      const newBalance = currentBalance + referralData.totalEarned;
      localStorage.setItem('gift_wallet_balance', newBalance.toString());
      
      // Обнуляем заработанные токены
      const updatedData = {
        ...referralData,
        totalEarned: 0
      };
      
      saveReferralData(updatedData);
      setReferralData(updatedData);
      
      return true;
    } catch (error) {
      console.error('Ошибка получения бонуса:', error);
      return false;
    }
  };

  return {
    referralData,
    referralLink,
    isLoading,
    copyReferralLink,
    claimReferralBonus
  };
} 
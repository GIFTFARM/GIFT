import { toV4Address } from './address';

// Интерфейс для реферальных данных
export interface ReferralData {
  referralCode: string;
  referrer?: string;
  referrals: string[];
  totalEarned: number;
}

// Ключи для хранения данных в localStorage
export const REFERRAL_STORAGE_KEYS = {
  REFERRAL_DATA: 'gift_referral_data',
  REFERRAL_CODE: 'gift_referral_code',
};

// Генерация уникального реферального кода
export function generateReferralCode(address: string): string {
  if (!address) return '';
  
  // Берем первые 8 символов адреса и добавляем случайные символы
  const prefix = address.substring(0, 8);
  const randomPart = Math.random().toString(36).substring(2, 6);
  
  return `${prefix}${randomPart}`.toUpperCase();
}

// Получение реферальной ссылки
export function getReferralLink(code: string): string {
  if (!code) return '';
  
  // В реальном приложении здесь будет домен вашего приложения
  return `https://giftfarm.ton/ref/${code}`;
}

// Сохранение реферальных данных
export function saveReferralData(data: ReferralData): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(REFERRAL_STORAGE_KEYS.REFERRAL_DATA, JSON.stringify(data));
}

// Загрузка реферальных данных
export function loadReferralData(address: string | null): ReferralData {
  if (typeof window === 'undefined' || !address) {
    return {
      referralCode: '',
      referrals: [],
      totalEarned: 0,
    };
  }
  
  const savedData = localStorage.getItem(REFERRAL_STORAGE_KEYS.REFERRAL_DATA);
  
  if (savedData) {
    return JSON.parse(savedData);
  }
  
  // Если данных нет, создаем новые
  const newData: ReferralData = {
    referralCode: generateReferralCode(address),
    referrals: [],
    totalEarned: 0,
  };
  
  saveReferralData(newData);
  return newData;
}

// Добавление нового реферала
export function addReferral(referrerCode: string, newUserAddress: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const savedData = localStorage.getItem(REFERRAL_STORAGE_KEYS.REFERRAL_DATA);
  
  if (!savedData) return false;
  
  const data: ReferralData = JSON.parse(savedData);
  
  if (data.referralCode !== referrerCode) return false;
  
  // Проверяем, что такого реферала еще нет
  if (!data.referrals.includes(newUserAddress)) {
    data.referrals.push(newUserAddress);
    data.totalEarned += 10; // Начисляем 10 GIFT за каждого реферала
    
    saveReferralData(data);
    return true;
  }
  
  return false;
}

// Проверка и сохранение реферера при первом входе
export function checkAndSaveReferrer(userAddress: string, referrerCode?: string): void {
  if (typeof window === 'undefined' || !userAddress) return;
  
  // Проверяем, есть ли уже сохраненные данные
  const savedData = localStorage.getItem(REFERRAL_STORAGE_KEYS.REFERRAL_DATA);
  
  // Если данных нет и есть код реферера, сохраняем его
  if (!savedData && referrerCode) {
    const newData: ReferralData = {
      referralCode: generateReferralCode(userAddress),
      referrer: referrerCode,
      referrals: [],
      totalEarned: 0,
    };
    
    saveReferralData(newData);
    
    // Добавляем текущего пользователя как реферала к рефереру
    addReferral(referrerCode, userAddress);
  }
} 
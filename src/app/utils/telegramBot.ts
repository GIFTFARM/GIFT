// Объявляем тип для глобального объекта Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

// Константы для работы с Telegram Bot API
export const TELEGRAM_BOT = {
  // Имя бота (без @)
  BOT_USERNAME: 'GiftFarmBot',
  
  // URL для создания ссылки на бота
  BOT_URL: 'https://t.me/GiftFarmBot',
  
  // URL для создания ссылки на мини-приложение
  MINI_APP_URL: 'https://t.me/GiftFarmBot/app',
  
  // URL для создания ссылки на мини-приложение с реферальным кодом
  getReferralUrl: (referralCode: string) => {
    return `https://t.me/GiftFarmBot/app?startapp=${referralCode}`;
  },
  
  // URL для создания ссылки на канал
  CHANNEL_URL: 'https://t.me/GiftFarmChannel',
  
  // URL для создания ссылки на группу
  GROUP_URL: 'https://t.me/GiftFarmGroup',
};

// Функция для открытия ссылки в Telegram
export const openTelegramUrl = (url: string) => {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  }
};

// Функция для создания ссылки на мини-приложение с реферальным кодом
export const createReferralLink = (referralCode: string) => {
  return TELEGRAM_BOT.getReferralUrl(referralCode);
};

// Функция для копирования текста в буфер обмена
export const copyToClipboard = (text: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Текст скопирован в буфер обмена');
      })
      .catch((err) => {
        console.error('Ошибка при копировании текста:', err);
      });
  } else {
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'успешно' : 'с ошибкой';
      console.log(`Текст скопирован ${msg}`);
    } catch (err) {
      console.error('Ошибка при копировании текста:', err);
    }
    
    document.body.removeChild(textArea);
  }
};

// Функция для проверки, запущено ли приложение в Telegram
export const isRunningInTelegram = () => {
  if (typeof window !== 'undefined') {
    return window.Telegram && window.Telegram.WebApp;
  }
  return false;
}; 
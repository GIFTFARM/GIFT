'use client';

import { useTelegram } from '../providers/TelegramProvider';
import { useTranslation } from '../hooks/useTranslation';

// Расширяем тип WebApp для включения метода shareUrl
interface TelegramWebAppWithShare {
  shareUrl: (url: string) => void;
  [key: string]: any;
}

interface TelegramShareButtonProps {
  text: string;
  url?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function TelegramShareButton({
  text,
  url,
  className = '',
  children,
}: TelegramShareButtonProps) {
  const { webApp, isReady } = useTelegram();
  const { t } = useTranslation();

  const handleShare = () => {
    if (!isReady || !webApp) {
      // Если приложение не запущено в Telegram, открываем стандартный диалог шаринга
      if (navigator.share) {
        navigator.share({
          title: 'GIFT FARM',
          text: text,
          url: url || window.location.href,
        }).catch((error) => console.error('Ошибка при шаринге:', error));
      } else {
        // Если Web Share API не поддерживается, копируем текст в буфер обмена
        const shareText = `${text} ${url || window.location.href}`;
        navigator.clipboard.writeText(shareText)
          .then(() => alert('Ссылка скопирована в буфер обмена'))
          .catch((error) => console.error('Ошибка при копировании:', error));
      }
      return;
    }

    try {
      // Используем Telegram Web App API для шаринга
      // @ts-ignore - Приводим к нашему типу с методом shareUrl
      const tgWebApp = webApp as TelegramWebAppWithShare;
      tgWebApp.shareUrl(url || window.location.href);
    } catch (error) {
      console.error('Ошибка при шаринге через Telegram:', error);
      
      // Fallback на стандартный шаринг
      if (navigator.share) {
        navigator.share({
          title: 'GIFT FARM',
          text: text,
          url: url || window.location.href,
        }).catch((error) => console.error('Ошибка при шаринге:', error));
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${className}`}
    >
      {children || t('share')}
    </button>
  );
} 
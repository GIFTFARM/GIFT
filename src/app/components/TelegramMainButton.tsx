'use client';

import { useEffect } from 'react';
import { useTelegram } from '../providers/TelegramProvider';
import { useTranslation } from '../hooks/useTranslation';

// Определяем тип для MainButton
interface TelegramMainButtonType {
  setText: (text: string) => void;
  setBackgroundColor: (color: string) => void;
  setTextColor: (color: string) => void;
  disable: () => void;
  enable: () => void;
  showProgress: (leaveText?: boolean) => void;
  hideProgress: () => void;
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  [key: string]: any;
}

interface TelegramMainButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  isVisible?: boolean;
  isLoading?: boolean;
  color?: string;
  textColor?: string;
}

export default function TelegramMainButton({
  text,
  onClick,
  disabled = false,
  isVisible = true,
  isLoading = false,
  color,
  textColor,
}: TelegramMainButtonProps) {
  const { webApp, isReady } = useTelegram();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isReady || !webApp) return;

    try {
      // @ts-ignore - MainButton может отсутствовать в типах, но существует в API
      if (!webApp.MainButton) {
        console.error('MainButton не найден в WebApp API');
        return;
      }

      // @ts-ignore - Приводим к нашему типу
      const mainButton: TelegramMainButtonType = webApp.MainButton;

      // Настраиваем текст кнопки
      mainButton.setText(text);

      // Настраиваем цвета, если они указаны
      if (color) {
        mainButton.setBackgroundColor(color);
      }
      if (textColor) {
        mainButton.setTextColor(textColor);
      }

      // Настраиваем состояние кнопки
      if (disabled) {
        mainButton.disable();
      } else {
        mainButton.enable();
      }

      if (isLoading) {
        mainButton.showProgress();
      } else {
        mainButton.hideProgress();
      }

      if (isVisible) {
        mainButton.show();
      } else {
        mainButton.hide();
      }

      // Добавляем обработчик клика
      mainButton.onClick(onClick);

      // Очистка при размонтировании
      return () => {
        mainButton.offClick(onClick);
        mainButton.hide();
      };
    } catch (error) {
      console.error('Ошибка при настройке MainButton:', error);
    }
  }, [isReady, webApp, text, onClick, disabled, isVisible, isLoading, color, textColor]);

  // Компонент не рендерит никакой UI, он только управляет кнопкой Telegram
  return null;
} 
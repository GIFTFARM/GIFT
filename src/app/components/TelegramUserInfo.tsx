'use client';

import { useTelegram } from '../providers/TelegramProvider';
import { useTranslation } from '../hooks/useTranslation';

export default function TelegramUserInfo() {
  const { user, isReady } = useTelegram();
  const { t } = useTranslation();

  if (!isReady) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <p className="text-gray-400">{t('telegramNotConnected')}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{t('telegramUser')}</h3>
      {user.id ? (
        <div className="flex flex-col space-y-1">
          <p>
            <span className="text-gray-400">{t('name')}:</span>{' '}
            {user.firstName} {user.lastName}
          </p>
          {user.username && (
            <p>
              <span className="text-gray-400">{t('username')}:</span> @{user.username}
            </p>
          )}
          <p>
            <span className="text-gray-400">ID:</span> {user.id}
          </p>
        </div>
      ) : (
        <p className="text-gray-400">{t('userInfoNotAvailable')}</p>
      )}
    </div>
  );
} 
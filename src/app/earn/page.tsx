'use client';

import { useTranslation } from '../hooks/useTranslation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiftIcon, 
  StatsIcon, 
  StarIcon,
  QuestionIcon,
  CrownIcon,
  EarnIcon,
  CheckIcon,
  TicketIcon,
  ProfileIcon,
  ImageIcon,
  ReferralsIcon
} from '../components/Icons';
import ConnectWalletButton from '../components/ConnectWalletButton';
import LanguageToggleButton from '../components/LanguageToggleButton';
import BottomNav from '../components/BottomNav';
import { useTonConnect } from '../hooks/useTonConnect';
import GiftGame from '../components/GiftGame';
import { useRouter } from 'next/navigation';
import WalletBalance from '../components/WalletBalance';

interface TelegramChannel {
  id: number;
  name: string;
  url: string;
  reward: number;
  isSubscribed: boolean;
  rewardClaimed?: boolean;
  description: string;
}

export default function EarnPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { walletBalance, isPro, tickets, setGiftBalance, useTicket } = useTonConnect();
  const [mounted, setMounted] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [channels, setChannels] = useState<TelegramChannel[]>([
    {
      id: 1,
      name: 'Paul',
      url: 'https://t.me/paul',
      reward: 3.33,
      isSubscribed: false,
      description: t('paulChannelDesc')
    },
    {
      id: 2, 
      name: 'NFT BABY',
      url: 'https://t.me/gifts_baby',
      reward: 4.20,
      isSubscribed: false,
      description: t('nftBabyChannelDesc')
    },
    {
      id: 3,
      name: 'GIFT FARM',
      url: 'https://t.me/GiftFarmTg',
      reward: 5.00,
      isSubscribed: false,
      description: t('giftFarmChannelDesc')
    }
  ]);

  const totalEarned = channels.reduce((sum, channel) => 
    channel.isSubscribed ? sum + channel.reward : sum, 0
  );

  const completedTasks = channels.filter(channel => channel.isSubscribed).length;

  const handleSubscribe = (channelId: number) => {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      // Открываем ссылку на канал в новой вкладке
      window.open(channel.url, '_blank');
      
      // Обновляем состояние канала
      setChannels(prev => prev.map(c => 
        c.id === channelId ? { ...c, isSubscribed: true } : c
      ));
      
      console.log(`Подписка на канал ${channel.name} оформлена`);
    }
  };

  const handleGetReward = (channelId: number) => {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      // Добавляем награду к балансу пользователя
      setGiftBalance(prev => {
        const newBalance = parseFloat((prev + channel.reward).toFixed(2));
        console.log(`Добавлено ${channel.reward.toFixed(2)} GIFT к балансу. Новый баланс: ${newBalance}`);
        return newBalance;
      });
      
      // Обновляем состояние канала
      setChannels(prev => prev.map(channel => 
        channel.id === channelId ? { ...channel, rewardClaimed: true } : channel
      ));
    }
  };

  const handleGameScore = (score: number) => {
    // Добавляем заработанные монеты к балансу пользователя
    const earnedCoins = parseFloat((score * 0.1).toFixed(2));
    setGiftBalance(prev => {
      const newBalance = parseFloat((prev + earnedCoins).toFixed(2));
      console.log(`Заработано ${earnedCoins} GIFT в игре. Новый баланс: ${newBalance}`);
      return newBalance;
    });
  };

  return (
    <main className="min-h-screen p-8 pb-24 bg-gradient-to-b from-black to-gray-900">
      {/* Декоративные элементы */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Отображаем баланс кошелька для мобильных устройств */}
      {isPro && <WalletBalance />}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-3 absolute top-4 right-4 z-30">
          <LanguageToggleButton />
          <button
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-amber-500/30 text-gray-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110 relative z-30 hover:shadow-md hover:shadow-amber-500/20"
          >
            <QuestionIcon className="w-5 h-5" />
          </button>
          <ConnectWalletButton />
        </div>

        {isPro && (
          <div className="absolute top-0 left-0 hidden md:flex items-center">
            <WalletBalance />
          </div>
        )}

        <h1 className={`text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50"></div>
            <EarnIcon className="w-8 h-8 text-white transform -rotate-12 relative z-10" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500/80 rounded-full animate-ping-slow"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-500/80 rounded-full animate-ping-slow animation-delay-500"></div>
          </div>
          <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            {t('earnMore')}
          </span>
        </h1>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -20 }}
            className="bg-gradient-to-br from-white/[0.03] to-transparent p-5 rounded-[1.5rem] text-center border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-12 h-12 mx-auto mb-2 bg-black/30 rounded-full flex items-center justify-center">
              <GiftIcon className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-sm text-gray-400">{t('earnedMoney')}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
              {totalEarned.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 20 }}
            className="bg-gradient-to-br from-white/[0.03] to-transparent p-5 rounded-[1.5rem] text-center border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-12 h-12 mx-auto mb-2 bg-black/30 rounded-full flex items-center justify-center">
              <StatsIcon className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-sm text-gray-400">{t('completedTasksCount')}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {completedTasks} / {channels.length}
            </p>
          </motion.div>
        </div>

        {/* Билеты */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          className="bg-gradient-to-r from-black/30 to-gray-900/30 p-4 rounded-[1.5rem] border border-white/10 shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-amber-500/5 mb-8 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
            <TicketIcon className="w-4 h-4 text-amber-400" /> {t('tickets')}
          </h3>
          <div className="flex items-center justify-between">
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
            
            <motion.button
              onClick={() => router.push('/game')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-amber-500/20 transition-all duration-300 flex items-center gap-2"
            >
              <GiftIcon className="w-5 h-5" />
              {t('playAndEarn')}
            </motion.button>
          </div>
        </motion.div>

        {/* Список каналов */}
        <div className="space-y-4">
          {channels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/[0.03] to-transparent p-6 rounded-[1.5rem] border border-white/5 shadow-inner transform transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden group backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black/30 rounded-xl flex items-center justify-center">
                    {channel.id === 1 && <ProfileIcon className="w-6 h-6 text-amber-400" />}
                    {channel.id === 2 && <ImageIcon className="w-6 h-6 text-amber-400" />}
                    {channel.id === 3 && <GiftIcon className="w-6 h-6 text-amber-400" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{channel.name}</h3>
                    <p className="text-sm text-gray-400">{channel.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-black/30 rounded-xl px-3 py-1">
                    <GiftIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 font-bold">+{channel.reward.toFixed(2)}</span>
                  </div>
                  {channel.isSubscribed && (
                    <span className="text-sm text-green-400 flex items-center gap-1 mt-2">
                      <CheckIcon className="w-4 h-4" />
                      {t('channelSubscribed')}
                    </span>
                  )}
                </div>
              </div>

              {!channel.isSubscribed ? (
                <button
                  onClick={() => handleSubscribe(channel.id)}
                  className="mt-4 w-full bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-amber-500/20 transition-all duration-300 relative z-10 flex items-center justify-center gap-2"
                >
                  <StarIcon className="w-5 h-5" />
                  {`${t('subscribeToChannel')}: ${channel.name}`}
                </button>
              ) : !channel.rewardClaimed ? (
                <button
                  onClick={() => handleGetReward(channel.id)}
                  className="mt-4 w-full bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-400/80 hover:to-emerald-400/80 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-green-500/20 transition-all duration-300 relative z-10 flex items-center justify-center gap-2"
                >
                  <GiftIcon className="w-5 h-5" />
                  {`${t('getReward')}: ${channel.reward.toFixed(2)} GIFT`}
                </button>
              ) : (
                <div className="mt-4 text-center text-sm text-gray-400">
                  {`${t('rewardReceived')}: ${channel.reward.toFixed(2)} GIFT`}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {isGameOpen && (
            <GiftGame
              onClose={() => setIsGameOpen(false)}
              onScoreUpdate={handleGameScore}
              tickets={tickets}
              useTicket={useTicket}
            />
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </main>
  );
} 
import { NFTItem } from '../utils/nft';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LightningIcon, TicketIcon, ClockIcon } from './Icons';
import { useTranslation } from '../hooks/useTranslation';

interface NFTCardProps {
  nft: NFTItem;
  onToggleFarming: () => void;
}

export default function NFTCard({ nft, onToggleFarming }: NFTCardProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [isFarmComplete, setIsFarmComplete] = useState(false);
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);

  useEffect(() => {
    if (!nft.isFarming || !nft.lastFarmTime) {
      setTimeLeft('');
      setProgress(0);
      setIsFarmComplete(false);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const farmStart = nft.lastFarmTime || 0;
      const farmEnd = farmStart + (12 * 60 * 60 * 1000); // 12 часов в миллисекундах
      const remaining = farmEnd - now;
      const totalDuration = 12 * 60 * 60 * 1000; // 12 часов
      const elapsed = totalDuration - remaining;
      const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      
      setProgress(progressPercent);

      // Проверяем, был ли фарминг офлайн
      // Если с момента начала фарминга прошло более 10 минут, показываем индикатор офлайн-фарминга
      const minutesSinceFarmStart = (now - farmStart) / (1000 * 60);
      setShowOfflineIndicator(minutesSinceFarmStart > 10);

      if (remaining <= 0) {
        setTimeLeft('Фарм завершен');
        setProgress(100);
        setIsFarmComplete(true);
        return;
      } else {
        setIsFarmComplete(false);
      }

      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

      setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    // Обновляем таймер каждую секунду
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nft.isFarming, nft.lastFarmTime]);

  // Определяем редкость NFT на основе атрибутов
  const getRarityColor = () => {
    const rarityAttr = nft.metadata.attributes?.find(attr => 
      attr.trait_type.toLowerCase() === 'rarity' || 
      attr.trait_type.toLowerCase() === 'редкость'
    );
    
    if (!rarityAttr) return 'from-blue-500/80 to-blue-600/80';
    
    const rarity = rarityAttr.value.toString().toLowerCase();
    
    if (rarity.includes('common') || rarity.includes('обычный')) 
      return 'from-blue-500/80 to-blue-600/80';
    if (rarity.includes('uncommon') || rarity.includes('необычный')) 
      return 'from-green-500/80 to-green-600/80';
    if (rarity.includes('rare') || rarity.includes('редкий')) 
      return 'from-purple-500/80 to-purple-600/80';
    if (rarity.includes('epic') || rarity.includes('эпический')) 
      return 'from-pink-500/80 to-pink-600/80';
    if (rarity.includes('legendary') || rarity.includes('легендарный')) 
      return 'from-amber-500/80 to-yellow-600/80';
    
    return 'from-blue-500/80 to-blue-600/80';
  };

  const rarityGradient = getRarityColor();

  return (
    <div 
      className="bg-gradient-to-b from-white/5 to-white/[0.02] rounded-2xl overflow-hidden border border-white/10 shadow-lg transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-amber-500/5 group"
    >
      <div className="relative w-full h-36 sm:h-48">
        {/* Градиент поверх изображения */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
        
        {/* Индикатор редкости */}
        <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 z-20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium text-white bg-gradient-to-r ${rarityGradient} shadow-md`}>
          {nft.metadata.attributes?.find(attr => 
            attr.trait_type.toLowerCase() === 'rarity' || 
            attr.trait_type.toLowerCase() === 'редкость'
          )?.value || 'Common'}
        </div>
        
        {/* Индикатор офлайн-фарминга */}
        {nft.isFarming && showOfflineIndicator && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium text-white bg-gradient-to-r from-gray-500/80 to-gray-600/80 shadow-md flex items-center gap-1">
            <ClockIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {t('offlineFarmingStatus')}
          </div>
        )}
        
        <Image
          src={nft.metadata.image}
          alt={nft.metadata.name}
          fill
          priority
          loading="eager"
          className="object-cover"
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        
        {/* Название NFT поверх изображения */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 z-10">
          <h4 className="font-semibold text-sm sm:text-base text-white text-shadow truncate">{nft.metadata.name}</h4>
        </div>
      </div>
      
      <div className="p-2 sm:p-4">
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 mb-2 sm:mb-3">
          {nft.metadata.attributes?.slice(0, 6).map((attr, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-black/30 to-black/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg text-center border border-white/5 transform transition-all duration-300 hover:from-black/40 hover:to-black/20 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-[8px] sm:text-[10px] text-amber-400/80 font-medium uppercase tracking-wide truncate">{attr.trait_type}</div>
              <div className="text-[10px] sm:text-xs font-medium text-white truncate">{attr.value.toString()}</div>
            </div>
          ))}
        </div>
        
        {nft.isFarming ? (
          <div className="relative">
            {/* Прогресс-бар */}
            <div className="w-full h-1 bg-black/30 rounded-full mb-2 sm:mb-3 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${rarityGradient}`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="text-center py-1.5 sm:py-2 px-2 sm:px-4 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30">
              <p className="text-xs sm:text-sm text-green-400 mb-0.5 sm:mb-1 flex items-center justify-center gap-1 sm:gap-2">
                <LightningIcon className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" /> 
                {isFarmComplete ? (
                  <span className="flex items-center gap-1">
                    {t('farmingCompleted')} <TicketIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-pulse" />
                  </span>
                ) : (
                  <>
                    {showOfflineIndicator ? t('farmingContinues') : t('farmingInProgress')}
                  </>
                )}
              </p>
              <p className="font-mono font-bold text-sm sm:text-base text-white">{timeLeft}</p>
              {showOfflineIndicator && !isFarmComplete && (
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">{t('farmingContinuesOffline')}</p>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={onToggleFarming}
            className="w-full py-2 sm:py-3 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 transition-all duration-300 text-white text-sm sm:text-base font-medium shadow-lg hover:shadow-amber-500/20 transform hover:translate-y-[-2px] flex items-center justify-center gap-1 sm:gap-2"
          >
            <LightningIcon className="w-4 h-4 sm:w-5 sm:h-5" /> {t('startFarming')}
          </button>
        )}
      </div>
    </div>
  );
} 
import NFTCard from './NFTCard';
import { NFTItem } from '../utils/nft';
import { useEffect, useState } from 'react';
import { SearchIcon, GiftIcon } from './Icons';

interface NFTGridProps {
  nfts: NFTItem[];
  onToggleFarming: (id: string) => void;
  isLoading?: boolean;
}

export default function NFTGrid({ nfts, onToggleFarming, isLoading = false }: NFTGridProps) {
  const [mounted, setMounted] = useState(false);
  
  // Эффект для анимации появления при загрузке
  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`animate-pulse transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="bg-gradient-to-b from-white/5 to-white/[0.02] rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <div className="w-full h-36 sm:h-48 bg-black/30"></div>
              <div className="p-3 sm:p-4">
                <div className="h-3 sm:h-4 bg-black/30 rounded-full w-3/4 mb-2"></div>
                <div className="h-3 sm:h-4 bg-black/30 rounded-full w-1/2 mb-3 sm:mb-4"></div>
                <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="bg-black/30 p-1 sm:p-2 rounded-xl h-10 sm:h-14"></div>
                  ))}
                </div>
                <div className="h-8 sm:h-10 bg-black/30 rounded-xl w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className={`text-center py-8 sm:py-12 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center transform rotate-12 shadow-lg shadow-amber-500/20 relative overflow-hidden mb-4 sm:mb-6">
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-50"></div>
          <SearchIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white transform -rotate-12 relative z-10" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Нет NFT</h3>
        <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto px-4 sm:px-0">
          У вас нет NFT из поддерживаемых коллекций. Приобретите NFT из поддерживаемых коллекций, чтобы начать фарминг.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {nfts.map((nft, index) => (
        <div 
          key={nft.id}
          className={`transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <NFTCard
            nft={nft}
            onToggleFarming={() => onToggleFarming(nft.id)}
          />
        </div>
      ))}
    </div>
  );
} 
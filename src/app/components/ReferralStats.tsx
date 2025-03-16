'use client';

import { useReferrals } from '../hooks/useReferrals';
import { FaUsers, FaGift } from 'react-icons/fa';
import Link from 'next/link';

export default function ReferralStats() {
  const { referralData, isLoading } = useReferrals();

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-4 shadow-lg animate-pulse">
        <div className="h-20 bg-gray-700/50 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Реферальная программа</h3>
        <Link href="/referrals" className="text-amber-400 text-sm hover:underline">
          Подробнее
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center">
            <div className="bg-indigo-600 p-2 rounded-lg mr-3">
              <FaUsers className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Рефералы</p>
              <p className="text-xl font-bold">{referralData.referrals.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center">
            <div className="bg-amber-600 p-2 rounded-lg mr-3">
              <FaGift className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Заработано</p>
              <p className="text-xl font-bold">{referralData.totalEarned.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {referralData.totalEarned > 0 && (
        <Link 
          href="/referrals" 
          className="mt-3 block w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-center py-2 rounded-lg font-medium"
        >
          Получить {referralData.totalEarned.toFixed(2)} GIFT
        </Link>
      )}
    </div>
  );
} 
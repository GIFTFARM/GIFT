'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { GiftIcon, HeartIcon, TicketIcon } from './Icons';

interface GiftGameProps {
  onClose: () => void;
  onScoreUpdate: (score: number) => void;
  tickets: number;
  useTicket: () => boolean;
}

export default function GiftGame({ onClose, onScoreUpdate, tickets, useTicket }: GiftGameProps) {
  const { t } = useTranslation();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [giftPosition, setGiftPosition] = useState(50);
  const [direction, setDirection] = useState(1);
  const [speed, setSpeed] = useState(2);
  const [isDropping, setIsDropping] = useState(false);
  const [stackPositions, setStackPositions] = useState<number[]>([]);
  const gameLoopRef = useRef<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [giftRotation, setGiftRotation] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [ticketUsed, setTicketUsed] = useState(false);

  // Игровой цикл
  useEffect(() => {
    if (isGameOver || !gameStarted) return;

    const updateGame = () => {
      setGiftPosition(prev => {
        let next = prev + direction * speed;
        
        // Если достигли границы, меняем направление
        if (next >= 90) {
          next = 90;
          setDirection(-1);
        } else if (next <= 10) {
          next = 10;
          setDirection(1);
        }
        
        return next;
      });

      setGiftRotation(prev => prev + 1);
    };

    const interval = window.setInterval(updateGame, 16) as unknown as number;
    gameLoopRef.current = interval;

    return () => {
      if (gameLoopRef.current !== null) {
        window.clearInterval(gameLoopRef.current);
      }
    };
  }, [speed, isGameOver]);

  // Обработка клика/тапа
  const handleDrop = () => {
    if (isDropping || isGameOver) return;

    setIsDropping(true);
    const lastPosition = stackPositions[stackPositions.length - 1] || giftPosition;
    const distance = Math.abs(giftPosition - lastPosition);

    if (distance > 10) {
      // Промах
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives === 0) {
          setIsGameOver(true);
          onScoreUpdate(score);
        }
        return newLives;
      });
    } else {
      // Успешное приземление
      setScore(prev => prev + 1);
      setSpeed(prev => Math.min(prev + 0.5, 6));
      setStackPositions(prev => [...prev, giftPosition]);
    }

    setTimeout(() => {
      setIsDropping(false);
    }, 500);
  };

  // Начало игры
  const handleStartGame = () => {
    // Проверяем, есть ли билетики
    if (!ticketUsed) {
      const success = useTicket();
      if (!success) {
        // Если билетиков нет, показываем сообщение
        alert(t('noTickets'));
        return;
      }
      setTicketUsed(true);
    }
    
    setGameStarted(true);
  };

  // Перезапуск игры
  const handleRestart = () => {
    // Проверяем, есть ли билетики для новой игры
    const success = useTicket();
    if (!success) {
      // Если билетиков нет, показываем сообщение
      alert(t('noTickets'));
      return;
    }
    
    setScore(0);
    setLives(3);
    setGiftPosition(50);
    setDirection(1);
    setSpeed(2);
    setStackPositions([]);
    setIsGameOver(false);
    setIsDropping(false);
    setGameStarted(true);
    setTicketUsed(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-[2rem] border border-white/10 shadow-xl w-full max-w-md mx-4">
        {/* Статистика */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <GiftIcon className="w-5 h-5 text-amber-400" />
            <span className="text-white font-bold">{t('gameScore')}: {score}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <TicketIcon className="w-5 h-5 text-amber-400" />
              <span className="text-white font-bold">{tickets}</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: lives }).map((_, i) => (
                <HeartIcon key={i} className="w-5 h-5 text-red-500" />
              ))}
            </div>
          </div>
        </div>

        {/* Игровое поле */}
        <div className="relative h-96 bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl border border-white/5 overflow-hidden">
          {!gameStarted && !isGameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-2">{t('startGame')}</h3>
                <p className="text-gray-400 text-sm mb-4">{t('ticketRequired')}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <TicketIcon className="w-6 h-6 text-amber-400" />
                  <span className="text-white font-bold text-lg">{tickets}</span>
                </div>
              </div>
              <button
                onClick={handleStartGame}
                disabled={tickets <= 0}
                className={`bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white py-3 px-6 rounded-xl font-medium shadow-lg transition-all duration-300 ${tickets <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-amber-500/20'}`}
              >
                {t('startGameButton')}
              </button>
            </div>
          )}
          {/* Падающий подарок */}
          <motion.div
            animate={{
              left: `${giftPosition}%`,
              top: isDropping ? '90%' : '0%',
              rotate: isDropping ? 0 : Math.sin(giftRotation * 0.1) * 15
            }}
            transition={{
              left: { type: "tween", duration: 0.1 },
              top: isDropping ? { 
                type: "spring",
                stiffness: 200,
                damping: 10
              } : { duration: 0 },
              rotate: { duration: 0.01 }
            }}
            className="absolute transform -translate-x-1/2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500/80 to-yellow-600/80 rounded-lg flex items-center justify-center shadow-lg">
              <GiftIcon className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Стопка подарков */}
          {stackPositions.map((pos, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-0 transform -translate-x-1/2"
              style={{ left: `${pos}%`, bottom: `${index * 40}px` }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/80 to-yellow-600/80 rounded-lg flex items-center justify-center shadow-lg">
                <GiftIcon className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Кнопки управления */}
        <div className="mt-6 flex gap-4">
          {isGameOver ? (
            <>
              <button
                onClick={handleRestart}
                disabled={tickets <= 0}
                className={`flex-1 bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white py-3 px-6 rounded-xl font-medium shadow-lg transition-all duration-300 ${tickets <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-amber-500/20'}`}
              >
                {t('playAgain')}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300"
              >
                {t('gameOver')}
              </button>
            </>
          ) : (
            gameStarted && (
              <button
                onClick={handleDrop}
                className="w-full bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
              >
                {t('playGame')}
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
} 
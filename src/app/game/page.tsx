'use client';

import { useTranslation } from '../hooks/useTranslation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GiftIcon, HeartIcon, TicketIcon } from '../components/Icons';
import { useRouter } from 'next/navigation';
import { useTonConnect } from '../hooks/useTonConnect';

export default function GamePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setGiftBalance, tickets, useTicket } = useTonConnect();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [giftPosition, setGiftPosition] = useState(50);
  const [direction, setDirection] = useState(1);
  const [speed, setSpeed] = useState(10);
  const [isDropping, setIsDropping] = useState(false);
  const [stackPositions, setStackPositions] = useState<number[]>([]);
  const gameLoopRef = useRef<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [giftRotation, setGiftRotation] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [ticketUsed, setTicketUsed] = useState(false);

  // Изменяем максимальное количество подарков
  const MAX_STACK_SIZE = 5;

  // Добавляем состояние для исчезающих подарков
  const [fadingGifts, setFadingGifts] = useState<{position: number, color: string}[]>([]);

  // Добавляем цвета для подарков
  const giftColors = [
    'from-amber-500 to-yellow-600',
    'from-pink-500 to-rose-600',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-green-600',
    'from-purple-500 to-violet-600'
  ];

  // Функция для получения случайного цвета
  const getRandomColor = () => {
    return giftColors[Math.floor(Math.random() * giftColors.length)];
  };

  const [currentGiftColor, setCurrentGiftColor] = useState(getRandomColor());
  const [stackColors, setStackColors] = useState<string[]>([]);

  // Обработка клика/тапа
  const handleDrop = useCallback(() => {
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
          // Начисляем монеты при окончании игры - фиксированное значение
          const fixedCoins = parseFloat((score * 0.1).toFixed(2)); // Каждое успешное приземление = 0.1 монеты
          console.log('Заработано очков:', score);
          console.log('Начисляем монеты (фиксированное):', fixedCoins);
          
          // Обновляем баланс через функцию setGiftBalance
          setGiftBalance(prev => {
            const newBalance = prev + fixedCoins;
            console.log('Текущий баланс:', prev);
            console.log('Новый баланс:', newBalance);
            return parseFloat(newBalance.toFixed(2));
          });
          
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }
        }
        return newLives;
      });
    } else {
      // Успешное приземление
      setScore(prev => prev + 1);
      setSpeed(prev => Math.min(prev + 1, 15));
      
      // Обновляем стек подарков
      setStackPositions(prev => {
        const newStack = [...prev, giftPosition];
        if (newStack.length > MAX_STACK_SIZE) {
          // Добавляем исчезающий подарок
          const removedPosition = newStack[0];
          const removedColor = stackColors[0];
          setFadingGifts(prev => [...prev, { position: removedPosition, color: removedColor }]);
          // Через 500мс удаляем исчезнувший подарок
          setTimeout(() => {
            setFadingGifts(prev => prev.filter(gift => gift.position !== removedPosition));
          }, 500);
          return newStack.slice(-MAX_STACK_SIZE);
        }
        return newStack;
      });

      setStackColors(prev => {
        const newColors = [...prev, currentGiftColor];
        if (newColors.length > MAX_STACK_SIZE) {
          return newColors.slice(-MAX_STACK_SIZE);
        }
        return newColors;
      });

      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }

    // Устанавливаем новый случайный цвет для следующего подарка
    setCurrentGiftColor(getRandomColor());

    setTimeout(() => {
      setIsDropping(false);
    }, 500);
  }, [isDropping, isGameOver, giftPosition, stackPositions, currentGiftColor, setGiftBalance, stackColors]);

  useEffect(() => {
    setMounted(true);

    // Добавляем управление с клавиатуры
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleDrop();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleDrop]);

  // Игровой цикл
  useEffect(() => {
    if (isGameOver || !gameStarted) return;

    let lastTime = performance.now();
    const targetFrameTime = 1000 / 60; // 60 FPS

    const updateGame = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= targetFrameTime) {
        setGiftPosition(prev => {
          const movement = direction * speed * (deltaTime / 250);
          let next = prev + movement;
          
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

        setGiftRotation(prev => prev + 4);
        lastTime = currentTime;
      }

      if (!isGameOver) {
        gameLoopRef.current = requestAnimationFrame(updateGame);
      }
    };

    gameLoopRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [direction, speed, isGameOver, gameStarted]);

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
    setSpeed(10);
    setStackPositions([]);
    setStackColors([]);
    setIsGameOver(false);
    setIsDropping(false);
    setGameStarted(true);
    setTicketUsed(true);
  };

  // Возврат на предыдущую страницу
  const handleBack = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        {/* Звёздочки */}
        <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-amber-400/50 rounded-full animate-twinkle"></div>
        <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 bg-yellow-400/50 rounded-full animate-twinkle animation-delay-500"></div>
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-amber-400/50 rounded-full animate-twinkle animation-delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Кнопка назад с эффектом */}
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8 bg-gradient-to-r from-white/10 to-white/5 hover:from-amber-500/20 hover:to-yellow-500/20 text-white px-6 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 group"
        >
          <span className="transform transition-transform group-hover:-translate-x-1">←</span>
          {t('back')}
        </motion.button>

        <div className="max-w-3xl mx-auto">
          {/* Статистика с анимацией */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6 bg-gradient-to-r from-black/50 to-gray-900/50 p-4 rounded-2xl backdrop-blur-sm border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center relative group">
                <GiftIcon className="w-6 h-6 text-amber-400 transform transition-transform group-hover:scale-110" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
              <div className="flex flex-col gap-1">
                <motion.p 
                  key={score}
                  initial={{ scale: 1.2, color: '#F59E0B' }}
                  animate={{ scale: 1, color: '#FFFFFF' }}
                  className="text-2xl font-bold"
                >
                  +{(score * 0.1).toFixed(2)} GIFT
                </motion.p>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
          </motion.div>

          {/* Игровое поле */}
          <div className="relative h-[70vh] max-h-[600px] bg-gradient-to-b from-gray-800/30 to-black/30 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm shadow-xl">
            {!gameStarted && !isGameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                <div className="text-center mb-8 px-6">
                  <h3 className="text-3xl font-bold text-white mb-4">{t('startGame')}</h3>
                  <p className="text-gray-300 text-lg mb-6">{t('ticketRequired')}</p>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500/30 to-yellow-600/30 transform rotate-12">
                      <TicketIcon className="w-8 h-8 text-amber-400 transform -rotate-12" />
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                      {tickets}
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={handleStartGame}
                  disabled={tickets <= 0}
                  whileHover={tickets > 0 ? { scale: 1.05 } : {}}
                  whileTap={tickets > 0 ? { scale: 0.95 } : {}}
                  className={`bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white py-4 px-10 rounded-xl text-xl font-medium shadow-lg transition-all duration-300 ${tickets <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-amber-500/20'}`}
                >
                  {t('startGameButton')}
                </motion.button>
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleDrop}
              className="relative h-[70vh] bg-gradient-to-b from-black/50 to-gray-900/50 rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm cursor-pointer"
            >
              {/* Падающий подарок */}
              <motion.div
                animate={{
                  left: `${giftPosition}%`,
                  top: isDropping ? '90%' : '0%',
                  rotate: isDropping ? 0 : Math.sin(giftRotation * 0.1) * 15,
                  scale: isDropping ? [1, 0.9, 1.1, 1] : 1
                }}
                transition={{
                  left: { type: "tween", duration: 0.1 },
                  top: isDropping ? { 
                    type: "spring",
                    stiffness: 200,
                    damping: 10
                  } : { duration: 0 },
                  rotate: { duration: 0.01 },
                  scale: isDropping ? {
                    duration: 0.3,
                    times: [0, 0.2, 0.5, 0.8]
                  } : { duration: 0 }
                }}
                className="absolute transform -translate-x-1/2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${currentGiftColor} rounded-xl flex items-center justify-center shadow-lg relative group`}>
                  <GiftIcon className="w-10 h-10 text-white transform transition-transform group-hover:scale-110" />
                  <div className={`absolute -inset-1 bg-gradient-to-r ${currentGiftColor} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/80 rounded-full animate-ping-slow"></div>
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping-slow animation-delay-500"></div>
                </div>
              </motion.div>

              {/* Стопка подарков */}
              {stackPositions.map((pos, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [0.8, 1.1, 1],
                    y: 0
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    scale: {
                      duration: 0.3,
                      times: [0, 0.6, 1]
                    }
                  }}
                  className="absolute bottom-0 transform -translate-x-1/2"
                  style={{ 
                    left: `${pos}%`, 
                    bottom: `${index * 64}px`
                  }}
                >
                  <motion.div
                    animate={{
                      y: [0, -4, 0],
                      scale: [1, 0.95, 1]
                    }}
                    transition={{
                      duration: 0.3,
                      times: [0, 0.5, 1],
                      delay: 0.1
                    }}
                    className={`w-16 h-16 bg-gradient-to-br ${stackColors[index]} rounded-xl flex items-center justify-center shadow-lg relative group`}
                  >
                    <GiftIcon className="w-10 h-10 text-white/90" />
                    <div className={`absolute -inset-1 bg-gradient-to-r ${stackColors[index]} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    
                    {/* Эффект приземления */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 0], opacity: [0, 0.5, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`absolute -inset-4 bg-gradient-to-r ${stackColors[index]} rounded-full opacity-20`}
                    />
                  </motion.div>
                </motion.div>
              ))}

              {/* Линия земли с анимацией при приземлении */}
              <div className="absolute bottom-0 left-0 w-full">
                <div className="h-1 bg-gradient-to-r from-amber-500/50 via-yellow-500/50 to-amber-500/50"></div>
                {isDropping && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.3 }}
                    style={{ left: `${giftPosition}%` }}
                    className="absolute bottom-0 w-32 h-32 -translate-x-1/2 bg-amber-500/10 rounded-full blur-xl"
                  />
                )}
              </div>
            </motion.div>

            {/* Добавляем исчезающие подарки */}
            {fadingGifts.map((gift, index) => (
              <motion.div
                key={`fading-${index}-${gift.position}`}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ 
                  opacity: 0,
                  scale: 0.8,
                  y: 20
                }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 transform -translate-x-1/2"
                style={{ 
                  left: `${gift.position}%`,
                  bottom: '0px'
                }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${gift.color} rounded-xl flex items-center justify-center shadow-lg relative group`}>
                  <GiftIcon className="w-10 h-10 text-white/90" />
                  <div className={`absolute -inset-1 bg-gradient-to-r ${gift.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Кнопки управления */}
          <div className="mt-8 flex gap-4">
            {isGameOver ? (
              <>
                <motion.button
                  onClick={handleRestart}
                  disabled={tickets <= 0}
                  whileHover={tickets > 0 ? { scale: 1.05 } : {}}
                  whileTap={tickets > 0 ? { scale: 0.95 } : {}}
                  className={`flex-1 bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white py-4 px-6 rounded-xl text-lg font-medium shadow-lg transition-all duration-300 ${tickets <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-amber-500/20'}`}
                >
                  {t('playAgain')}
                </motion.button>
                <motion.button
                  onClick={handleBack}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-xl text-lg font-medium transition-all duration-300"
                >
                  {t('gameOver')}
                </motion.button>
              </>
            ) : (
              gameStarted && (
                <motion.button
                  onClick={handleDrop}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-amber-500/80 to-yellow-600/80 hover:from-amber-400/80 hover:to-yellow-500/80 text-white py-4 px-6 rounded-xl text-lg font-medium shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
                >
                  {t('playGame')}
                </motion.button>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 
export type TranslationKey = 
  | 'main' 
  | 'referrals' 
  | 'profile' 
  | 'connectWallet' 
  | 'totalNFTs' 
  | 'farming' 
  | 'readyToCollect' 
  | 'startAll' 
  | 'collectCoins' 
  | 'collected' 
  | 'getPro' 
  | 'getProForFarming' 
  | 'learnMore' 
  | 'updateList' 
  | 'loading' 
  | 'yourNFTs' 
  | 'speed' 
  | 'tickets'
  | 'balance'
  | 'inWallet'
  | 'proAccount'
  | 'regularAccount'
  | 'expires'
  | 'getPROButton'
  | 'statistics'
  | 'totalHoursFarming'
  | 'referralProgram'
  | 'goToReferralProgram'
  | 'connectWalletForProfile'
  | 'yourAddress'
  | 'copy'
  | 'copied'
  | 'farmingSpeed'
  | 'perHour'
  | 'ticketsForFullCycle'
  | 'buyProTon'
  | 'giftBalance'
  | 'completedFarming'
  | 'nftCompleted'
  | 'collectFarmAndTickets'
  | 'connectWalletToStart'
  | 'referralProgramTitle'
  | 'referralProgramDesc'
  | 'yourReferralLink'
  | 'referralsCount'
  | 'earned'
  | 'bonus'
  | 'availableToCollect'
  | 'getBonus'
  | 'bonusCollected'
  | 'howItWorks'
  | 'copyReferralLink'
  | 'shareLink'
  | 'getReferralBonus'
  | 'getPassiveIncome'
  | 'status'
  | 'offlineFarmingTitle'
  | 'offlineFarmingDesc'
  | 'ticketsInfo'
  | 'collectFarmNowDesc'
  | 'referralBonusInfo'
  | 'farmingTitle'
  | 'proBadge'
  | 'minute'
  | 'minutes2to4'
  | 'minutes5plus'
  | 'ticketsTitle'
  | 'ticket'
  | 'tickets2to4'
  | 'tickets5plus'
  | 'startFarming'
  | 'farmingCompleted'
  | 'farmingInProgress'
  | 'farmingContinues'
  | 'farmingContinuesOffline'
  | 'offlineFarmingStatus'
  | 'earn'
  | 'earnMore'
  | 'telegramTasks'
  | 'subscribeToChannel'
  | 'channelSubscribed'
  | 'getReward'
  | 'rewardReceived'
  | 'availableReward'
  | 'telegramChannel'
  | 'completedTasks'
  | 'playGame'
  | 'gameOver'
  | 'gameScore'
  | 'livesLeft'
  | 'playAgain'
  | 'back'
  | 'startGame'
  | 'ticketRequired'
  | 'startGameButton'
  | 'earnedMoney'
  | 'completedTasksCount'
  | 'playAndEarn'
  | 'noTickets'
  | 'paulChannelDesc'
  | 'nftBabyChannelDesc'
  | 'giftFarmChannelDesc'
  | 'welcomeTitle'
  | 'welcomeHowToStart'
  | 'welcomeStep1Title'
  | 'welcomeStep1Desc'
  | 'welcomeStep2Title'
  | 'welcomeStep2Desc'
  | 'welcomeStep3Title'
  | 'welcomeStep3Desc'
  | 'welcomeStep4Title'
  | 'welcomeProFeature1'
  | 'welcomeProFeature2'
  | 'welcomeProFeature3'
  | 'welcomeStep5Title'
  | 'welcomeStep5Desc'
  | 'welcomeStartButton'
  | 'welcomeFooter1'
  | 'welcomeFooter2';

type Translations = {
  [key in TranslationKey]: {
    ru: string;
    en: string;
  };
};

export const translations: Translations = {
  main: {
    ru: 'Главная',
    en: 'Home'
  },
  referrals: {
    ru: 'Рефералы',
    en: 'Referrals'
  },
  profile: {
    ru: 'Профиль',
    en: 'Profile'
  },
  connectWallet: {
    ru: 'Подключите кошелёк',
    en: 'Connect Wallet'
  },
  totalNFTs: {
    ru: 'Всего NFT',
    en: 'Total NFTs'
  },
  farming: {
    ru: 'Фармят',
    en: 'Farming'
  },
  readyToCollect: {
    ru: 'Готовы к сбору',
    en: 'Ready to collect'
  },
  startAll: {
    ru: 'Запустить все',
    en: 'Start all'
  },
  collectCoins: {
    ru: 'Собрать монеты',
    en: 'Collect coins'
  },
  collected: {
    ru: 'Собрано!',
    en: 'Collected!'
  },
  getPro: {
    ru: 'Купить PRO (0.1 TON)',
    en: 'Buy PRO (0.1 TON)'
  },
  getProForFarming: {
    ru: 'Получить PRO для управления фармом',
    en: 'Get PRO for farm management'
  },
  learnMore: {
    ru: 'Узнать больше о проекте',
    en: 'Learn more about the project'
  },
  updateList: {
    ru: 'Обновить список',
    en: 'Update list'
  },
  loading: {
    ru: 'Загрузка...',
    en: 'Loading...'
  },
  yourNFTs: {
    ru: 'Ваши NFT',
    en: 'Your NFTs'
  },
  speed: {
    ru: 'Скорость',
    en: 'Speed'
  },
  tickets: {
    ru: 'Билеты',
    en: 'Tickets'
  },
  balance: {
    ru: 'Баланс',
    en: 'Balance'
  },
  inWallet: {
    ru: 'В кошельке',
    en: 'In wallet'
  },
  proAccount: {
    ru: 'PRO аккаунт',
    en: 'PRO account'
  },
  regularAccount: {
    ru: 'Обычный аккаунт',
    en: 'Regular account'
  },
  expires: {
    ru: 'Истекает',
    en: 'Expires'
  },
  getPROButton: {
    ru: 'Получить PRO',
    en: 'Get PRO'
  },
  statistics: {
    ru: 'Статистика',
    en: 'Statistics'
  },
  totalHoursFarming: {
    ru: 'Часов фарма',
    en: 'Farming hours'
  },
  referralProgram: {
    ru: 'Реферальная программа',
    en: 'Referral program'
  },
  goToReferralProgram: {
    ru: 'Перейти к реферальной программе',
    en: 'Go to referral program'
  },
  connectWalletForProfile: {
    ru: 'Подключите кошелёк для доступа к профилю',
    en: 'Connect wallet to access profile'
  },
  yourAddress: {
    ru: 'Ваш адрес',
    en: 'Your address'
  },
  copy: {
    ru: 'Копировать',
    en: 'Copy'
  },
  copied: {
    ru: 'Скопировано!',
    en: 'Copied!'
  },
  farmingSpeed: {
    ru: 'Скорость',
    en: 'Speed'
  },
  perHour: {
    ru: 'GIFT/час',
    en: 'GIFT/hour'
  },
  ticketsForFullCycle: {
    ru: '(за полный цикл фарминга)',
    en: '(for full farming cycle)'
  },
  buyProTon: {
    ru: 'Купить PRO (0.1 TON)',
    en: 'Buy PRO (0.1 TON)'
  },
  giftBalance: {
    ru: 'Баланс GIFT:',
    en: 'GIFT Balance:'
  },
  completedFarming: {
    ru: 'завершил полный цикл фарминга!',
    en: 'completed full farming cycle!'
  },
  nftCompleted: {
    ru: 'NFT завершили полный цикл фарминга!',
    en: 'NFTs completed full farming cycle!'
  },
  collectFarmAndTickets: {
    ru: 'Собрать фарм и получить билеты',
    en: 'Collect farm and get tickets'
  },
  connectWalletToStart: {
    ru: 'Чтобы начать фарминг GIFT с помощью ваших NFT, необходимо подключить кошелёк TON Keeper',
    en: 'To start farming GIFT with your NFTs, you need to connect TON Keeper wallet'
  },
  referralProgramTitle: {
    ru: 'Реферальная программа',
    en: 'Referral Program'
  },
  referralProgramDesc: {
    ru: 'Приглашай друзей и получай 10 GIFT за каждого приглашенного и 5% от их заработка! Чем больше друзей ты пригласишь, тем больше токенов заработаешь.',
    en: 'Invite friends and get 10 GIFT for each referral and 5% of their earnings! The more friends you invite, the more tokens you earn.'
  },
  yourReferralLink: {
    ru: 'Твоя реферальная ссылка',
    en: 'Your referral link'
  },
  referralsCount: {
    ru: 'Рефералов',
    en: 'Referrals'
  },
  earned: {
    ru: 'Заработано',
    en: 'Earned'
  },
  bonus: {
    ru: 'Бонус',
    en: 'Bonus'
  },
  availableToCollect: {
    ru: 'Доступно для получения:',
    en: 'Available to collect:'
  },
  getBonus: {
    ru: 'Получить бонус',
    en: 'Get bonus'
  },
  bonusCollected: {
    ru: 'Получено!',
    en: 'Collected!'
  },
  howItWorks: {
    ru: 'Как это работает?',
    en: 'How it works?'
  },
  copyReferralLink: {
    ru: 'Скопируй свою уникальную реферальную ссылку',
    en: 'Copy your unique referral link'
  },
  shareLink: {
    ru: 'Поделись ссылкой с друзьями через Telegram',
    en: 'Share the link with friends via Telegram'
  },
  getReferralBonus: {
    ru: 'Получи 10 GIFT за каждого приглашенного',
    en: 'Get 10 GIFT for each referral'
  },
  getPassiveIncome: {
    ru: 'Получай 5% от заработка рефералов',
    en: 'Get 5% of referrals earnings'
  },
  status: {
    ru: 'Статус',
    en: 'Status'
  },
  offlineFarmingTitle: {
    ru: 'Фарминг продолжался офлайн!',
    en: 'Farming continued offline!'
  },
  offlineFarmingDesc: {
    ru: 'Пока вас не было, ваши NFT заработали',
    en: 'While you were away, your NFTs earned'
  },
  ticketsInfo: {
    ru: 'Используйте билеты для участия в розыгрышах и игры (1 игра = 1 билет)',
    en: 'Use tickets to participate in raffles and games (1 game = 1 ticket)'
  },
  collectFarmNowDesc: {
    ru: 'Соберите фарм сейчас и получите билеты в качестве бонуса!',
    en: 'Collect farm now and get tickets as a bonus!'
  },
  referralBonusInfo: {
    ru: 'Приглашай друзей и получай +5% от их фарма в качестве бонуса!',
    en: 'Invite friends and get +5% of their farming as a bonus!'
  },
  farmingTitle: {
    ru: 'Фарминг',
    en: 'Farming'
  },
  proBadge: {
    ru: 'PRO',
    en: 'PRO'
  },
  minute: {
    ru: 'минуту',
    en: 'minute'
  },
  minutes2to4: {
    ru: 'минуты',
    en: 'minutes'
  },
  minutes5plus: {
    ru: 'минут',
    en: 'minutes'
  },
  ticketsTitle: {
    ru: 'Билеты',
    en: 'Tickets'
  },
  ticket: {
    ru: 'билет',
    en: 'ticket'
  },
  tickets2to4: {
    ru: 'билета',
    en: 'tickets'
  },
  tickets5plus: {
    ru: 'билетов',
    en: 'tickets'
  },
  startFarming: {
    ru: 'Начать фарм',
    en: 'Start farming'
  },
  farmingCompleted: {
    ru: 'Фарм завершен',
    en: 'Farming completed'
  },
  farmingInProgress: {
    ru: 'Идет фарминг',
    en: 'Farming in progress'
  },
  farmingContinues: {
    ru: 'Фарм продолжается',
    en: 'Farming continues'
  },
  farmingContinuesOffline: {
    ru: 'Фарминг продолжается даже офлайн',
    en: 'Farming continues even offline'
  },
  offlineFarmingStatus: {
    ru: 'Офлайн-фарм',
    en: 'Offline farming'
  },
  earn: {
    ru: 'Заработать',
    en: 'Earn'
  },
  earnMore: {
    ru: 'Заработок',
    en: 'Earn'
  },
  telegramTasks: {
    ru: 'Задания в Telegram',
    en: 'Telegram Tasks'
  },
  subscribeToChannel: {
    ru: 'Подписаться на канал',
    en: 'Subscribe to channel'
  },
  channelSubscribed: {
    ru: 'Вы подписаны',
    en: 'Subscribed'
  },
  getReward: {
    ru: 'Получить награду',
    en: 'Get reward'
  },
  rewardReceived: {
    ru: 'Награда получена',
    en: 'Reward received'
  },
  availableReward: {
    ru: 'Доступная награда',
    en: 'Available reward'
  },
  telegramChannel: {
    ru: 'Telegram канал',
    en: 'Telegram channel'
  },
  completedTasks: {
    ru: 'Выполнено заданий',
    en: 'Completed tasks'
  },
  playGame: {
    ru: 'Играть',
    en: 'Play'
  },
  gameOver: {
    ru: 'Завершить',
    en: 'Game Over'
  },
  gameScore: {
    ru: 'Счёт',
    en: 'Score'
  },
  livesLeft: {
    ru: 'Жизни',
    en: 'Lives'
  },
  playAgain: {
    ru: 'Играть снова',
    en: 'Play Again'
  },
  back: {
    ru: 'Назад',
    en: 'Back'
  },
  startGame: {
    ru: 'Начать игру',
    en: 'Start Game'
  },
  ticketRequired: {
    ru: 'Для начала игры будет использован 1 билетик',
    en: 'One ticket will be used to start the game'
  },
  startGameButton: {
    ru: 'Начать игру (1 билетик)',
    en: 'Start Game (1 ticket)'
  },
  earnedMoney: {
    ru: 'Заработано',
    en: 'Earned'
  },
  completedTasksCount: {
    ru: 'Выполнено задач',
    en: 'Completed Tasks'
  },
  playAndEarn: {
    ru: 'Играть и заработать GIFT (1 билет)',
    en: 'Play and earn GIFT (1 ticket)'
  },
  noTickets: {
    ru: 'У вас нет билетиков для игры!',
    en: 'You have no tickets for the game!'
  },
  paulChannelDesc: {
    ru: 'Официальный канал Павла Дурова',
    en: 'Official channel of Pavel Durov'
  },
  nftBabyChannelDesc: {
    ru: 'Розыгрыши NFT и GIFTS',
    en: 'NFT and GIFTS giveaways'
  },
  giftFarmChannelDesc: {
    ru: 'Официальный канал приложения GIFT FARM',
    en: 'Official channel of GIFT FARM app'
  },
  welcomeTitle: {
    ru: 'GIFT FARM',
    en: 'GIFT FARM'
  },
  welcomeHowToStart: {
    ru: 'Как начать фарминг?',
    en: 'How to start farming?'
  },
  welcomeStep1Title: {
    ru: '1. Подключите кошелек',
    en: '1. Connect your wallet'
  },
  welcomeStep1Desc: {
    ru: 'Используйте TON Keeper для подключения вашего кошелька. Это безопасно и займет всего несколько секунд.',
    en: 'Use TON Keeper to connect your wallet. It\'s secure and takes just a few seconds.'
  },
  welcomeStep2Title: {
    ru: '2. Выберите NFT',
    en: '2. Choose your NFTs'
  },
  welcomeStep2Desc: {
    ru: 'После подключения вы увидите все ваши NFT из поддерживаемых коллекций. Каждая NFT может приносить 1 GIFT токен в час.',
    en: 'After connecting, you\'ll see all your NFTs from supported collections. Each NFT can earn 1 GIFT token per hour.'
  },
  welcomeStep3Title: {
    ru: '3. Начните фарминг',
    en: '3. Start farming'
  },
  welcomeStep3Desc: {
    ru: 'Нажмите кнопку "Начать фарм" на любой NFT. Фарминг будет продолжаться 12 часов, после чего вы сможете собрать токены.',
    en: 'Click the "Start farming" button on any NFT. Farming will continue for 12 hours, after which you can collect your tokens.'
  },
  welcomeStep4Title: {
    ru: '4. PRO возможности',
    en: '4. PRO features'
  },
  welcomeProFeature1: {
    ru: 'Увеличение скорости фарма в 1.5 раза',
    en: 'Increase farming speed by 1.5 times'
  },
  welcomeProFeature2: {
    ru: 'Запуск всех NFT одной кнопкой',
    en: 'Start all NFTs with one click'
  },
  welcomeProFeature3: {
    ru: 'Автоматический сбор наград',
    en: 'Automatic reward collection'
  },
  welcomeStep5Title: {
    ru: '5. Билеты',
    en: '5. Tickets'
  },
  welcomeStep5Desc: {
    ru: 'За каждый полный цикл фарминга (12 часов) вы получаете билеты. Билеты можно использовать для участия в розыгрышах и получения бонусов.',
    en: 'For each complete farming cycle (12 hours), you receive tickets. Tickets can be used to participate in raffles and get bonuses.'
  },
  welcomeStartButton: {
    ru: 'Начать фарминг',
    en: 'Start farming'
  },
  welcomeFooter1: {
    ru: 'Проект использует смарт-контракты в сети TON',
    en: 'The project uses smart contracts on the TON network'
  },
  welcomeFooter2: {
    ru: 'Все операции безопасны и прозрачны',
    en: 'All operations are secure and transparent'
  }
};

export function getTranslation(key: TranslationKey, language: 'ru' | 'en'): string {
  return translations[key][language];
} 
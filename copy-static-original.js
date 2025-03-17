const fs = require('fs');
const path = require('path');

// Функция для рекурсивного копирования директорий
function copyDir(src, dest) {
  // Создаем директорию назначения, если она не существует
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Получаем содержимое исходной директории
  const entries = fs.readdirSync(src, { withFileTypes: true });

  // Копируем каждый файл/директорию
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Рекурсивно копируем поддиректории
      copyDir(srcPath, destPath);
    } else {
      // Копируем файл
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Копируем файлы из .next/static в out/_next/static
console.log('Копирование файлов из .next/static в out/_next/static...');
copyDir('.next/static', 'out/_next/static');

// Копируем файлы из public в out
console.log('Копирование файлов из public в out...');
copyDir('public', 'out');

// Создаем файл index.html в директории out
console.log('Создание файла index.html в директории out...');
const indexHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=GIFT/">
  <title>Перенаправление</title>
</head>
<body>
  <p>Перенаправление на <a href="GIFT/">GIFT FARM</a>...</p>
</body>
</html>`;
fs.writeFileSync('out/index.html', indexHtml);

// Создаем директорию out/GIFT, если она не существует
if (!fs.existsSync('out/GIFT')) {
  fs.mkdirSync('out/GIFT', { recursive: true });
}

// Поиск последнего билда
console.log('Поиск последнего билда...');
const staticDir = '.next/static';
const buildIds = fs.readdirSync(staticDir)
  .filter(file => !file.includes('.') && file !== 'chunks' && file !== 'css' && file !== 'media' && file !== 'development');

const latestBuildId = buildIds[buildIds.length - 1];
console.log(`Найден билд: ${latestBuildId}`);

// Поиск CSS-файла
console.log('Поиск CSS-файла...');
const cssDir = 'out/_next/static/css';
const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
const latestCssFile = cssFiles[0]; // Берем первый CSS-файл
console.log(`Найден CSS-файл: ${latestCssFile}`);

// Копируем файлы из .next/server/app в out/GIFT
console.log('Копирование файлов из .next/server/app в out/GIFT...');
if (fs.existsSync('.next/server/app')) {
  copyDir('.next/server/app', 'out/GIFT');
}

// Копируем файлы из .next/server/pages в out/GIFT
console.log('Копирование файлов из .next/server/pages в out/GIFT...');
if (fs.existsSync('.next/server/pages')) {
  copyDir('.next/server/pages', 'out/GIFT');
}

// Создаем директорию для loading страницы, если она не существует
console.log('Создание директории для loading страницы...');
if (!fs.existsSync('out/GIFT/loading')) {
  fs.mkdirSync('out/GIFT/loading', { recursive: true });
}

// Создаем файл index.html в директории out/GIFT/loading
console.log('Создание файла index.html в директории out/GIFT/loading...');
const loadingHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>GIFT FARM - Загрузка</title>
  <link rel="stylesheet" href="https://giftfarm.github.io/GIFT/_next/static/css/${latestCssFile}">
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #111827;
      color: white;
    }
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .loading-text {
      font-size: 18px;
      font-weight: bold;
      margin-top: 10px;
    }
  </style>
</head>
<body class="bg-gray-900 text-white">
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <div class="loading-text">Загрузка GIFT FARM...</div>
  </div>
  <script>
    // Инициализация Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
    
    // Перенаправляем на welcome страницу через 2 секунды
    setTimeout(() => {
      window.location.href = '../welcome/';
    }, 2000);
  </script>
</body>
</html>`;
fs.writeFileSync('out/GIFT/loading/index.html', loadingHtml);

// Создаем файл index.html в директории out/GIFT
console.log('Создание файла index.html в директории out/GIFT...');
const giftIndexHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=loading/">
  <title>Перенаправление</title>
</head>
<body>
  <p>Перенаправление на <a href="loading/">GIFT FARM Loading</a>...</p>
</body>
</html>`;
fs.writeFileSync('out/GIFT/index.html', giftIndexHtml);

// Определяем JavaScript файлы для каждой страницы
const pageScripts = {
  'welcome': 'page-059920ae0c5479b5.js',
  'earn': 'page-18c32e819ea43383.js',
  'game': 'page-f777ab58bec7942d.js',
  'profile': 'page-a2f0165d1e9c9851.js',
  'referrals': 'page-36765e07fdc3d6a9.js'
};

// Модифицируем HTML файлы для всех страниц
const pages = ['welcome', 'earn', 'game', 'profile', 'referrals'];
console.log('Модификация HTML файлов для всех страниц...');

pages.forEach(page => {
  const pageDir = `out/GIFT/${page}`;
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  
  // Создаем index.html для каждой страницы
  const pageHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>GIFT FARM - ${page.charAt(0).toUpperCase() + page.slice(1)}</title>
  <link rel="stylesheet" href="https://giftfarm.github.io/GIFT/_next/static/css/${latestCssFile}">
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body class="bg-gray-900 text-white">
  <div id="__next">
    <div class="app-container">
      <div id="app-root"></div>
    </div>
  </div>
  <script>
    // Инициализация Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  </script>
  <script src="https://giftfarm.github.io/GIFT/_next/static/chunks/webpack-ef9890f74b74343e.js"></script>
  <script src="https://giftfarm.github.io/GIFT/_next/static/chunks/framework-acf8fb4df35d6caf.js"></script>
  <script src="https://giftfarm.github.io/GIFT/_next/static/chunks/main-45ccf7fc0b793fcd.js"></script>
  <script src="https://giftfarm.github.io/GIFT/_next/static/chunks/pages/_app-7c52400d7efa30ce.js"></script>
  <script src="https://giftfarm.github.io/GIFT/_next/static/chunks/app/${page}/${pageScripts[page]}"></script>
  <script src="https://giftfarm.github.io/GIFT/_next/static/chunks/app/layout-aec418e64fadf961.js"></script>
  <script src="https://giftfarm.github.io/GIFT/_next/static/${latestBuildId}/_buildManifest.js"></script>
  <script src="https://giftfarm.github.io/GIFT/_next/static/${latestBuildId}/_ssgManifest.js"></script>
</body>
</html>`;
  fs.writeFileSync(`${pageDir}/index.html`, pageHtml);
});

// Создаем директорию для мини-игр, если она не существует
console.log('Создание директории для мини-игр...');
if (!fs.existsSync('out/GIFT/minigames')) {
  fs.mkdirSync('out/GIFT/minigames', { recursive: true });
}

// Создаем HTML файл для мини-игр
console.log('Создание файла index.html в директории out/GIFT/minigames...');
const minigamesHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>GIFT FARM - Мини-игры</title>
  <link rel="stylesheet" href="https://giftfarm.github.io/GIFT/_next/static/css/${latestCssFile}">
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    .minigames-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .minigame-card {
      background-color: #1f2937;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .minigame-card:hover {
      transform: translateY(-3px);
    }
    .minigame-icon {
      width: 50px;
      height: 50px;
      background-color: #374151;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      font-size: 24px;
    }
    .minigame-info {
      flex: 1;
    }
    .minigame-title {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 5px;
    }
    .minigame-description {
      font-size: 14px;
      color: #9ca3af;
    }
    .back-button {
      display: inline-block;
      background-color: #4b5563;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      margin-bottom: 20px;
      text-decoration: none;
      font-weight: bold;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
  </style>
</head>
<body class="bg-gray-900 text-white">
  <div class="minigames-container">
    <div class="header">
      <a href="../game/" class="back-button">← Назад</a>
      <h1>Мини-игры</h1>
    </div>
    
    <div class="minigame-card" onclick="alert('Мини-игра 1 скоро будет доступна!')">
      <div class="minigame-icon">🎮</div>
      <div class="minigame-info">
        <div class="minigame-title">Кликер GIFT</div>
        <div class="minigame-description">Кликай и собирай монеты GIFT</div>
      </div>
    </div>
    
    <div class="minigame-card" onclick="alert('Мини-игра 2 скоро будет доступна!')">
      <div class="minigame-icon">🎯</div>
      <div class="minigame-info">
        <div class="minigame-title">GIFT Пазл</div>
        <div class="minigame-description">Собери пазл и получи бонусные монеты</div>
      </div>
    </div>
    
    <div class="minigame-card" onclick="alert('Мини-игра 3 скоро будет доступна!')">
      <div class="minigame-icon">🎲</div>
      <div class="minigame-info">
        <div class="minigame-title">GIFT Лотерея</div>
        <div class="minigame-description">Испытай удачу и выиграй монеты</div>
      </div>
    </div>
  </div>
  
  <script>
    // Инициализация Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  </script>
</body>
</html>`;
fs.writeFileSync('out/GIFT/minigames/index.html', minigamesHtml);

// Проверяем и удаляем директорию out/GIFT/GIFT, если она существует
console.log('Проверка и удаление директории out/GIFT/GIFT...');
if (fs.existsSync('out/GIFT/GIFT')) {
  fs.rmSync('out/GIFT/GIFT', { recursive: true, force: true });
}

console.log('Готово!'); 
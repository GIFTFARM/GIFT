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

// Читаем содержимое тестовой страницы
const testPageContent = fs.readFileSync('test-telegram-app.html', 'utf8');

// Создаем файл index.html в директории out/GIFT
console.log('Создание файла index.html в директории out/GIFT...');
const giftIndexHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=welcome/">
  <title>Перенаправление</title>
</head>
<body>
  <p>Перенаправление на <a href="welcome/">GIFT FARM Welcome</a>...</p>
</body>
</html>`;
fs.writeFileSync('out/GIFT/index.html', giftIndexHtml);

// Определяем страницы для создания
const pages = ['welcome', 'earn', 'game', 'profile', 'referrals'];

// Создаем директории и файлы для каждой страницы
console.log('Создание директорий и файлов для каждой страницы...');
pages.forEach(page => {
  const pageDir = `out/GIFT/${page}`;
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  
  // Используем тестовую страницу для всех страниц
  fs.writeFileSync(`${pageDir}/index.html`, testPageContent);
});

// Создаем директорию для мини-игр, если она не существует
console.log('Создание директории для мини-игр...');
if (!fs.existsSync('out/GIFT/minigames')) {
  fs.mkdirSync('out/GIFT/minigames', { recursive: true });
}

// Используем тестовую страницу для мини-игр
fs.writeFileSync('out/GIFT/minigames/index.html', testPageContent);

// Проверяем и удаляем директорию out/GIFT/GIFT, если она существует
console.log('Проверка и удаление директории out/GIFT/GIFT...');
if (fs.existsSync('out/GIFT/GIFT')) {
  fs.rmSync('out/GIFT/GIFT', { recursive: true, force: true });
}

console.log('Готово!'); 
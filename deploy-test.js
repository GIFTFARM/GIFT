const { execSync } = require('child_process');
const fs = require('fs');

// Функция для выполнения команды и вывода результата
function runCommand(command) {
  console.log(`Выполняем команду: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return true;
  } catch (error) {
    console.error(`Ошибка при выполнении команды: ${error.message}`);
    return false;
  }
}

// Проверяем, существует ли директория out
if (!fs.existsSync('out')) {
  console.error('Директория out не существует. Сначала запустите скрипт copy-static-test.js');
  process.exit(1);
}

// Инициализируем Git в директории out, если это еще не сделано
if (!fs.existsSync('out/.git')) {
  console.log('Инициализация Git в директории out...');
  if (!runCommand('cd out && git init')) {
    process.exit(1);
  }
}

// Добавляем все файлы в индекс
console.log('Добавление файлов в индекс...');
if (!runCommand('cd out && git add .')) {
  process.exit(1);
}

// Создаем коммит
console.log('Создание коммита...');
if (!runCommand('cd out && git commit -m "Deploy test app"')) {
  process.exit(1);
}

// Добавляем удаленный репозиторий, если он еще не добавлен
console.log('Проверка удаленного репозитория...');
try {
  execSync('cd out && git remote -v', { encoding: 'utf8' });
  console.log('Удаленный репозиторий уже добавлен');
} catch (error) {
  console.log('Добавление удаленного репозитория...');
  if (!runCommand('cd out && git remote add origin https://github.com/giftfarm/GIFT.git')) {
    process.exit(1);
  }
}

// Отправляем изменения в ветку gh-pages
console.log('Отправка изменений в ветку gh-pages...');
if (!runCommand('cd out && git push -f origin HEAD:gh-pages')) {
  process.exit(1);
}

console.log('Деплой завершен успешно!');
console.log('Приложение будет доступно по адресу: https://giftfarm.github.io/GIFT/GIFT/welcome/');
console.log('Обратите внимание, что обновление может занять некоторое время (обычно до 10 минут).'); 
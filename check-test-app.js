const https = require('https');

// URL для проверки
const url = 'https://giftfarm.github.io/GIFT/GIFT/welcome/';

console.log(`Проверяем URL: ${url}`);

// Отправляем GET-запрос
https.get(url, (res) => {
  console.log(`Статус ответа: ${res.statusCode}`);
  console.log('Заголовки ответа:');
  console.log(res.headers);
  
  let body = '';
  
  // Получаем данные
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  // Завершение получения данных
  res.on('end', () => {
    console.log('Тело ответа (первые 500 символов):');
    console.log(body.substring(0, 500) + '...');
    
    // Проверяем наличие ключевых элементов в HTML
    if (body.includes('GIFT FARM')) {
      console.log('✅ Найден текст GIFT FARM');
    } else {
      console.log('❌ Не найден текст GIFT FARM');
    }
    
    if (body.includes('telegram-web-app.js')) {
      console.log('✅ Найден скрипт Telegram Web App');
    } else {
      console.log('❌ Не найден скрипт Telegram Web App');
    }
    
    if (body.includes('window.Telegram.WebApp.expand()')) {
      console.log('✅ Найден код для расширения приложения');
    } else {
      console.log('❌ Не найден код для расширения приложения');
    }
    
    if (body.includes('Подключить кошелёк')) {
      console.log('✅ Найдена кнопка подключения кошелька');
    } else {
      console.log('❌ Не найдена кнопка подключения кошелька');
    }
  });
}).on('error', (err) => {
  console.error(`Ошибка: ${err.message}`);
}); 
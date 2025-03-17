const https = require('https');

// URL для проверки
const urls = [
  'https://giftfarm.github.io/GIFT/GIFT/',
  'https://giftfarm.github.io/GIFT/GIFT/loading/',
  'https://giftfarm.github.io/GIFT/GIFT/welcome/',
  'https://giftfarm.github.io/GIFT/GIFT/earn/',
  'https://giftfarm.github.io/GIFT/GIFT/game/',
  'https://giftfarm.github.io/GIFT/GIFT/profile/',
  'https://giftfarm.github.io/GIFT/GIFT/referrals/',
  'https://giftfarm.github.io/GIFT/GIFT/minigames/'
];

// Функция для проверки URL
function checkUrl(url) {
  return new Promise((resolve, reject) => {
    console.log(`\nПроверяем URL: ${url}`);
    
    https.get(url, (res) => {
      console.log(`Статус ответа: ${res.statusCode}`);
      
      let body = '';
      
      // Получаем данные
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      // Завершение получения данных
      res.on('end', () => {
        // Проверяем наличие ключевых элементов в HTML
        const checks = [
          { name: 'Скрипт Telegram Web App', pattern: 'telegram-web-app.js' },
          { name: 'Div с id="app-root"', pattern: 'id="app-root"' },
          { name: 'Div с id="__next"', pattern: 'id="__next"' }
        ];
        
        console.log('Проверка элементов:');
        checks.forEach(check => {
          if (body.includes(check.pattern)) {
            console.log(`✅ Найден ${check.name}`);
          } else {
            console.log(`❌ Не найден ${check.name}`);
          }
        });
        
        resolve({
          url,
          status: res.statusCode,
          success: res.statusCode === 200,
          checks: checks.map(check => ({
            name: check.name,
            found: body.includes(check.pattern)
          }))
        });
      });
    }).on('error', (err) => {
      console.error(`Ошибка: ${err.message}`);
      resolve({
        url,
        status: 'error',
        success: false,
        error: err.message,
        checks: []
      });
    });
  });
}

// Проверяем все URL
async function checkAllUrls() {
  console.log('Проверяем доступность приложения...');
  
  const results = [];
  for (const url of urls) {
    const result = await checkUrl(url);
    results.push(result);
  }
  
  // Выводим итоги
  console.log('\n=== Итоги проверки ===');
  const successful = results.filter(r => r.success).length;
  console.log(`Успешно: ${successful}/${urls.length}`);
  
  if (successful !== urls.length) {
    console.log('\nНедоступные страницы:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`- ${r.url}: ${r.status}`);
    });
  }
  
  // Проверяем наличие ключевых элементов
  const allChecks = results.flatMap(r => r.checks);
  const missingElements = allChecks.filter(c => !c.found);
  
  if (missingElements.length > 0) {
    console.log('\nОтсутствующие элементы:');
    missingElements.forEach(c => {
      const page = results.find(r => r.checks.some(check => check.name === c.name && !check.found));
      console.log(`- ${c.name} на странице ${page.url}`);
    });
  }
  
  console.log('\nПроверка завершена!');
}

checkAllUrls(); 
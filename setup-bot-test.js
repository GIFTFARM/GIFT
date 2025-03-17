const axios = require('axios');
const fs = require('fs');

// Загружаем конфигурацию бота
const botConfig = JSON.parse(fs.readFileSync('bot-config.json', 'utf8'));
const { botToken } = botConfig;

// URL веб-приложения
const webAppUrl = 'https://giftfarm.github.io/GIFT/GIFT/welcome/';

// Функция для обновления настроек бота
async function setupBot() {
  try {
    // Получаем информацию о боте
    const botInfoResponse = await axios.get(`https://api.telegram.org/bot${botToken}/getMe`);
    const botInfo = botInfoResponse.data.result;
    
    console.log('Информация о боте:');
    console.log(`ID: ${botInfo.id}`);
    console.log(`Имя: ${botInfo.first_name}`);
    console.log(`Имя пользователя: @${botInfo.username}`);
    
    // Устанавливаем команды бота
    const commandsResponse = await axios.post(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
      commands: [
        {
          command: 'start',
          description: 'Запустить бота'
        },
        {
          command: 'app',
          description: 'Открыть веб-приложение'
        },
        {
          command: 'help',
          description: 'Получить помощь'
        }
      ]
    });
    
    if (commandsResponse.data.ok) {
      console.log('Команды бота успешно установлены');
    } else {
      console.error('Ошибка при установке команд бота:', commandsResponse.data);
    }
    
    // Устанавливаем кнопку меню
    const menuButtonResponse = await axios.post(`https://api.telegram.org/bot${botToken}/setChatMenuButton`, {
      menu_button: {
        type: 'web_app',
        text: 'Открыть приложение',
        web_app: {
          url: webAppUrl
        }
      }
    });
    
    if (menuButtonResponse.data.ok) {
      console.log('Кнопка меню успешно установлена');
    } else {
      console.error('Ошибка при установке кнопки меню:', menuButtonResponse.data);
    }
    
    // Устанавливаем команду для веб-приложения
    const webAppCommandResponse = await axios.post(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
      commands: [
        {
          command: 'app',
          description: 'Открыть GIFT FARM'
        }
      ],
      scope: {
        type: 'default'
      }
    });
    
    if (webAppCommandResponse.data.ok) {
      console.log('Команда веб-приложения успешно установлена');
    } else {
      console.error('Ошибка при установке команды веб-приложения:', webAppCommandResponse.data);
    }
    
    console.log('\nНастройка бота завершена!');
    console.log(`Ссылка на бота: https://t.me/${botInfo.username}`);
    console.log(`Ссылка на веб-приложение: https://t.me/${botInfo.username}/app`);
    
    // Создаем скрипт для отправки сообщения с кнопкой веб-приложения
    const sendAppButtonScript = `const axios = require('axios');

// Токен бота
const botToken = '${botToken}';

// ID чата (замените на свой ID)
const chatId = '737876374';

// URL веб-приложения
const webAppUrl = '${webAppUrl}';

// Отправляем сообщение с кнопкой
async function sendAppButton() {
  try {
    const response = await axios.post(\`https://api.telegram.org/bot\${botToken}/sendMessage\`, {
      chat_id: chatId,
      text: 'Нажмите на кнопку ниже, чтобы открыть GIFT FARM:',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Открыть GIFT FARM',
              web_app: {
                url: webAppUrl
              }
            }
          ]
        ]
      }
    });
    
    if (response.data.ok) {
      console.log('Сообщение с кнопкой успешно отправлено');
    } else {
      console.error('Ошибка при отправке сообщения:', response.data);
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error.message);
  }
}

sendAppButton();`;
    
    fs.writeFileSync('send-app-button.js', sendAppButtonScript);
    console.log('\nСоздан скрипт send-app-button.js для отправки сообщения с кнопкой веб-приложения');
    console.log('Замените YOUR_CHAT_ID на свой ID чата и запустите скрипт для отправки сообщения');
    
  } catch (error) {
    console.error('Ошибка при настройке бота:', error.message);
  }
}

setupBot(); 
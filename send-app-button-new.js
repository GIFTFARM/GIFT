const axios = require('axios');
const fs = require('fs');

// Загружаем конфигурацию бота
const botConfig = JSON.parse(fs.readFileSync('bot-config-new.json', 'utf8'));
const { botToken } = botConfig;

// ID чата (замените на свой ID)
const chatId = '5298461512'; // Здесь должен быть ID чата, который вставил пользователь

// URL веб-приложения
const webAppUrl = 'https://giftfarm.github.io/GIFT/GIFT/';

// Отправляем сообщение с кнопкой
async function sendAppButton() {
  try {
    console.log('Отправка сообщения с кнопкой веб-приложения...');
    console.log(`Токен бота: ${botToken.substring(0, 10)}...${botToken.substring(botToken.length - 5)}`);
    console.log(`ID чата: ${chatId}`);
    console.log(`URL приложения: ${webAppUrl}`);
    
    const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: 'БРАТАН! Нажми на кнопку ниже, чтобы открыть GIFT FARM:',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🎮 Открыть GIFT FARM',
              web_app: {
                url: webAppUrl
              }
            }
          ]
        ]
      }
    });
    
    if (response.data.ok) {
      console.log('✅ Сообщение с кнопкой успешно отправлено!');
      console.log('Теперь ты можешь открыть Telegram и нажать на кнопку, чтобы запустить приложение.');
    } else {
      console.error('❌ Ошибка при отправке сообщения:', response.data);
    }
  } catch (error) {
    console.error('❌ Ошибка при отправке сообщения:', error.message);
    
    if (error.response) {
      console.error('Детали ошибки:', error.response.data);
    }
  }
}

sendAppButton(); 
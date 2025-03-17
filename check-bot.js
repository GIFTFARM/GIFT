const axios = require('axios');
const fs = require('fs');

// Загружаем конфигурацию бота
const botConfig = JSON.parse(fs.readFileSync('bot-config.json', 'utf8'));
const { botToken } = botConfig;

// Функция для проверки бота
async function checkBot() {
  try {
    console.log('Проверка бота...');
    console.log(`Токен бота: ${botToken.substring(0, 5)}...${botToken.substring(botToken.length - 5)}`);
    
    const response = await axios.get(`https://api.telegram.org/bot${botToken}/getMe`);
    
    if (response.data.ok) {
      const botInfo = response.data.result;
      console.log('\n✅ Бот успешно проверен!');
      console.log(`ID: ${botInfo.id}`);
      console.log(`Имя: ${botInfo.first_name}`);
      console.log(`Имя пользователя: @${botInfo.username}`);
      console.log(`Может присоединяться к группам: ${botInfo.can_join_groups}`);
      console.log(`Может читать все сообщения группы: ${botInfo.can_read_all_group_messages}`);
      console.log(`Поддерживает встроенные запросы: ${botInfo.supports_inline_queries}`);
      
      return true;
    } else {
      console.error('\n❌ Ошибка при проверке бота:', response.data);
      return false;
    }
  } catch (error) {
    console.error('\n❌ Ошибка при проверке бота:', error.message);
    
    if (error.response) {
      console.error('Детали ошибки:', error.response.data);
    }
    
    return false;
  }
}

checkBot(); 
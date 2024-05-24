const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TGBOT_TOKEN; // config.env
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === '/start') {
    bot.sendMessage(chatId, "Welcome to Lynx!\n\nI was made with love by Lucas Gabriel (lucmsilva)!\n\nCheck out my source code:\nhttps://github.com/lucmsilva651/lynx");
  }
});

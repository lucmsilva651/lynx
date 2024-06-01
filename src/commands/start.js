const fs = require('fs');
const path = require('path');

module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  const blocklistPath = path.join(__dirname, '../../blocklist.txt');
  let blocklist = [];
  try {
    blocklist = fs.readFileSync(blocklistPath, 'utf8').split('\n').map(id => id.trim());
  } catch (err) {
    console.error(`Erro ao carregar a blocklist: ${err}`);
  }

  if (blocklist.includes(userId)) {
    bot.sendMessage(chatId, "You are blocked from use this bot.\nDon't even try using a alternative account, as you will be blocked too.");
    return;
  }

  const userName = msg.from.first_name;
  const message = `Hello! I am Lynx!\nI was made with love by Lucas Gabriel (lucmsilva)!\n\nSee /help for the bot commands!`;

  bot.sendMessage(chatId, message)
    .catch(error => console.error('ERROR: Message cannot be sent:', error));
  console.log(`INFO: /start executed by ${userName}, ${userId}`);
}

module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  const userId = msg.from.id;
  const lynxProfilePhoto = 'https://graph.org/file/10452df450f13ffb968c5.jpg';

  const message = `*Hello! I am Lynx!*\nI was made with love by Lucas Gabriel (lucmsilva)!\n\nSee /help for the bot commands!`;
  
  bot.sendPhoto(chatId, lynxProfilePhoto, { caption: message, parse_mode: 'Markdown' } )
    .catch(error => console.error('ERROR: Message cannot be sent:', error));
  console.log(`INFO: /start executed by ${userName}, ${userId}`);
}

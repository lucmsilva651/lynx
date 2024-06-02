module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const lynxProfilePhoto = 'https://graph.org/file/10452df450f13ffb968c5.jpg';

  const message = `*Hello! I am Lynx!*\nI was made with love by Lucas Gabriel (lucmsilva)!\n\n` +
  `*Before using, you will need to read the privacy policy (/privacy) ` +
  `to understand where your data goes when using this bot.*\n\n` +
  `Also, you can use /help to show the bot commands!`;
  
  bot.sendPhoto(chatId, lynxProfilePhoto, { caption: message, parse_mode: 'Markdown' } )
    .catch(error => console.error('WARN: Message cannot be sent:', error));
}

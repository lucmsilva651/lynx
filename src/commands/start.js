module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  const userId = msg.from.id;

  const message = `Hello! I am Lynx!\nI was made with love by Lucas Gabriel (lucmsilva)!\n\nSee /help for the bot commands!`
  
  bot.sendMessage(chatId, message)
    .catch(error => console.error('ERROR: Message cannot be sent:', error));
  console.log(`INFO: /start executed by ${userName}, ${userId}`)
}
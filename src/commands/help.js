module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  const userId = msg.from.id;

  const message = `Hi! I am Lynx!\nI am a simple bot made entirely from scratch in Node.js by Lucas Gabriel (lucmsilva).\n\nSome commands to test:
  • /start: start the bot
  • /help: send this message
  • /whois: send some information about yourself\n\nSee my source code in:
  • https://github.com/lucmsilva651/lynx.\n\nThanks to all users, testers, contributors, and others. Without you, perhaps this bot wouldn't be possible ❤️`;
  
  bot.sendMessage(chatId, message, {disable_web_page_preview: true})
    .catch(error => console.error('ERROR: Message cannot be send:', error));
  console.log(`INFO: /help executed by ${userName}, ${userId}`);
}

module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  const userId = msg.from.id;
  const lynxPhoto = 'https://graph.org/file/a77382dab4d62ba626806.jpg'

  const message = `Hi! I am Lynx!\nI am a simple bot made entirely from scratch in Node.js by Lucas Gabriel (lucmsilva).\n\nSome commands to test:
  • /start: start the bot
  • /help: send this message
  • /whois: send some information about yourself
  • /chatinfo: send some information about the group
  • /furry: check if you are a furry
  • /gay: check if you are a gay\n\nSee my source code in:
  • https://github.com/lucmsilva651/lynx.\n\nThanks to all users, testers, contributors, and others. Without you, perhaps this bot wouldn't be possible ❤️`;
  
  bot.sendPhoto(chatId, lynxPhoto, { caption: message })
    .catch(error => console.error('ERROR: Message cannot be send:', error));
  console.log(`INFO: /help executed by ${userName}, ${userId}`);
}

module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const lynxFullPhoto = 'https://graph.org/file/a77382dab4d62ba626806.jpg';

  const message = `*Hello! I'm Lynx!*\n\nI'm a simple bot made entirely from scratch in Node.js by Lucas Gabriel (lucmsilva).\n\n` +
  `I am running on a *GitHub Codespaces* server, and sometimes may I am off, so please refrain from overusing or spamming the bot!\n\n` +
  `*Some commands to test:*
  • */chatinfo* - send some information about the group
  • */customize* - customize your pronouns (WIP)
  • */furry* - check if you are a furry
  • */gay* - check if you are gay
  • */help* - send this message
  • */privacy* - read the Privacy Policy
  • */random* - pick a random number between 0-10
  • */start* - start the bot
  • */whois* - send some information about yourself\n\n` +
  `*See my source code in:* [GitHub Repository](https://github.com/lucmsilva651/lynx)\n\n` +
  `Thanks to all users, testers, contributors, and others. Without you, perhaps this bot wouldn't be possible ❤️`;
  
  bot.sendPhoto(chatId, lynxFullPhoto, { caption: message, parse_mode: 'Markdown' })
    .catch(error => console.error('WARN: Message cannot be sent: ', error));
}

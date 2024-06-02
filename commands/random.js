module.exports = function(bot, msg) {
  const chatId = msg.chat.id;

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const randomValue = getRandomInt(11);

  const message = `*Generated value:* ${randomValue}`;

  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
    .catch(error => console.error('WARN: Message cannot be sent: ', error));
  }
  
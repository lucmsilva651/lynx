module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  const userId = msg.from.id;
  let isGay = "";

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const randomValue = getRandomInt(2);

  if (randomValue === 0) {
    isGay = `*You (${userName}) are not gay.*`;
  } else {
    isGay = `*Yes, you (${userName}) are gay.*`;
  }

  const message = `${isGay}`;

  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
    .catch(error => console.error('WARN: Message cannot be sent:', error));
  console.log(`INFO: /gay executed by ${userName}, ${userId}`);
}

module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  const userId = msg.from.id;
  let isFurry = "";

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const randomValue = getRandomInt(2);

  if (randomValue === 0) {
    isFurry = `You (${userName}) are not a furry.`;
  } else {
    isFurry = `Yes, you (${userName}) are a furry.`;
  };

  const message = `${isFurry}`;
  
  bot.sendMessage(chatId, message)
    .catch(error => console.error('ERROR: Message cannot be sent:', error));
  console.log(`INFO: /furry executed by ${userName}, ${userId}`)
}
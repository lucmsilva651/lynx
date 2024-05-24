module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  const userId = msg.from.id;
  const userHandle = msg.from.username;
  const isBot = msg.from.is_bot;
  const userPremium = msg.from.is_premium;
  let userPremiumOutput = "";
  
  if (userPremium) {
    userPremiumOutput = "You have a Telegram Premium subscription.";
  } else {
    userPremiumOutput = "You don't have a Telegram Premium subscription.";
  }

  const message = `Your name is: ${userName}\nYour username is: ${userHandle}\nYour ID is: ${userId}\nYou are a bot: ${isBot}\n\n${userPremiumOutput}`;

  bot.sendMessage(chatId, message)
    .catch(error => console.error('ERROR: Message cannot be send:', error));
  console.log(`INFO: /whois executed by ${userName}, ${userId}`)
}
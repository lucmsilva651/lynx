module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  const userId = msg.from.id;
  const userHandle = msg.from.username;
  const isBot = msg.from.is_bot;
  const userPremium = msg.from.is_premium;
  const userLang = msg.from.language_code;
  let haveUsername = "";
  let userPremiumOutput = "";
  
  if (userPremium) {
    userPremiumOutput = "You have a Telegram Premium subscription.";
  } else {
    userPremiumOutput = "You don't have a Telegram Premium subscription.";
  };

  if (userHandle) {
    haveUsername = `Your username is: @${userHandle}`;
  } else {
    haveUsername = "Your username is: none";
  };

  const message = `Your name is: ${userName}\n${haveUsername}\nYour ID is: ${userId}\nYou are a bot: ${isBot}\nYour language: ${userLang}\n\n${userPremiumOutput}`;

  bot.sendMessage(chatId, message)
    .catch(error => console.error('ERROR: Message cannot be sent:', error));
  console.log(`INFO: /whois executed by ${userName}, ${userId}`)
}
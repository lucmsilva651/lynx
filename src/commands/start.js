// start command handler
module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Welcome to Lynx!\n\nI was made with love by Lucas Gabriel (lucmsilva)!\n\nCheck out my source code:\nhttps://github.com/lucmsilva651/lynx")
  console.log("INFO: /start executed.")
}
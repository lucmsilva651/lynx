module.exports = function(bot, msg) {
  const chatId = msg.chat.id;

  const message = `O usuario foi bamido com sucesso`;
  
  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
    .catch(error => console.error('WARN: Message cannot be sent: ', error));
}
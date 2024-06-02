module.exports = function(bot, msg) {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;
    const userId = msg.from.id;

    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            keyboard: [
              [{text: 'He/Him'}],
              [{text: 'She/Her'}],
              [{text: 'They/Them'}],
            ],
        }
    };

    const message = "Select your pronouns:";

    bot.sendMessage(chatId, message, opts,{ parse_mode: 'Markdown' })
    .catch(error => console.error('ERROR: Message cannot be sent:', error));
  console.log(`INFO: /customize executed by ${userName}, ${userId}`);
}

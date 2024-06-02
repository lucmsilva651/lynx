module.exports = function(bot, msg) {
  const chatId = msg.chat.id;

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
    },
    parse_mode: 'Markdown'
  };

  const message = "Select your pronouns:";
  const message2 = "You selected He/Him";
  const message3 = "You selected She/Her";
  const message4 = "You selected They/Them";

  bot.sendMessage(chatId, message, opts)
  .catch(error => console.error('WARN: Message cannot be sent: ', error));
  
  bot.onText('He/Him', (msg) => {
    bot.sendMessage(msg.chat.id, message2, {
      reply_markup: {
        remove_keyboard: true
      }
      })
    .catch(error => console.error('WARN: Message cannot be sent: ', error));
});

bot.onText('She/Her', (msg) => {
  bot.sendMessage(msg.chat.id, message3, {
    reply_markup: {
      remove_keyboard: true
    }
    })
  .catch(error => console.error('WARN: Message cannot be sent: ', error));
});

bot.onText('They/Them', (msg) => {
  bot.sendMessage(msg.chat.id, message4, {
    reply_markup: {
      remove_keyboard: true
    }
    })
  .catch(error => console.error('WARN: Message cannot be sent: ', error));
});

}

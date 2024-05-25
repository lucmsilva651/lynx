module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const chatName = msg.chat.title;
  const userName = msg.from.first_name;
  const userId = msg.from.id;
  const chatHandle = msg.chat.username;
  const isForum = msg.chat.is_forum;
  let isForumOutput = "";
  let chatHandleOutput = "";

  if (isForum) {
    isForumOutput = "This chat is a forum (has topics enabled)";
  } else {
    isForumOutput = "This chat is not a forum (doesn't have topics enabled)";
  }

  if (chatHandle) {
    chatHandleOutput = `Chat handle: @${chatHandle}`;
  } else {
    chatHandleOutput = `Chat handle: none (private group)`;
  }

  const message = `Chat name: ${chatName}\n${chatHandleOutput}\nChat ID: ${chatId}\n\n${isForumOutput}`;

  bot.sendMessage(chatId, message)
    .catch(error => console.error('ERROR: Message cannot be sent:', error));
  console.log(`INFO: /chatinfo executed by ${userName}, ${userId}`);
}
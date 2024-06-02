module.exports = function(bot, msg) {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  const userId = msg.from.id;
  const chatName = msg.chat.title;
  const chatHandle = msg.chat.username;
  const isForum = msg.chat.is_forum;
  let chatNameOutput = "";
  let chatHandleOutput = "";
  let isForumOutput = "";

  if (isForum) {
    isForumOutput = "*This chat is a forum (has topics enabled).*";
  } else {
    isForumOutput = "*This chat is not a forum (doesn't have topics enabled).*";
  }

  if (chatHandle) {
    chatHandleOutput = `*Chat handle:* @${chatHandle}`;
  } else {
    chatHandleOutput = `*Chat handle:* none (private group)`;
  }
  
  // if chatName returns undefined, the chat is not a group or channel
  if (chatName) {
    chatNameOutput = `*Chat name:* ${chatName}\n${chatHandleOutput}\n*Chat ID:* ${chatId}\n\n${isForumOutput}`;
  } else {
    chatNameOutput = "Whoops!\nThis command doesn't work in PM.";
  }
  
  const message = chatNameOutput;

  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
    .catch(error => console.error('ERROR: Message cannot be sent:', error));
  console.log(`INFO: /chatinfo executed by ${userName}, ${userId}`);
}

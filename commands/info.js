const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

async function getUserInfo(ctx) {
  const Strings = getStrings(ctx.from.language_code);

  userInfo = Strings.userInfo
    .replace('{userName}', ctx.from.first_name || Strings.unKnown)
    .replace('{userId}', ctx.from.id || Strings.unKnown)
    .replace('{userHandle}', ctx.from.username ? `@${ctx.from.username}` : Strings.varNone)
    .replace('{userPremium}', ctx.from.is_premium ? Strings.varYes : Strings.varNo)
    .replace('{userLang}', ctx.from.language_code || Strings.unKnown);

  return userInfo;
}

async function getChatInfo(ctx) {
  const Strings = getStrings(ctx.from.language_code);
  if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    chatInfo = Strings.chatInfo
      .replace('{chatId}', ctx.chat.id || Strings.unKnown)
      .replace('{chatName}', ctx.chat.title || Strings.unKnown)
      .replace('{chatHandle}', ctx.chat.username ? `@${ctx.chat.username}` : Strings.varNone)
      .replace('{chatMembersCount}', await ctx.getChatMembersCount(ctx.chat.id || Strings.unKnown))
      .replace('{chatType}', ctx.chat.type || Strings.unKnown)
      .replace('{isForum}', ctx.chat.is_forum ? Strings.varYes : Strings.varNo);
    
    return chatInfo;
  } else {
    return ctx.reply(
      Strings.groupOnly, {
      parse_mode: 'Markdown',
      reply_to_message_id: ctx.message.message_id
    });
  }
}

module.exports = (bot) => {
  bot.command('chatinfo', spamwatchMiddleware, async (ctx) => {
    const chatInfo = await getChatInfo(ctx);
    ctx.reply(
      chatInfo, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      }
    );
  });

  bot.command('userinfo', spamwatchMiddleware, async (ctx) => {
    const userInfo = await getUserInfo(ctx);
    ctx.reply(
      userInfo, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      }
    );
  });
};

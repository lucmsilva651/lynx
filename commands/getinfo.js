const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

async function getUserInfo(ctx) {
  const Strings = getStrings(ctx.from.language_code);
  let userInfoTemplate = Strings.userInfo;

  const userName = ctx.from.first_name || Strings.unKnown;
  const userId = ctx.from.id || Strings.unKnown;
  const userHandle = ctx.from.username ? `@${ctx.from.username}` : Strings.varNone;
  const isBot = ctx.from.is_bot ? Strings.varYes : Strings.varNo;
  const userPremium = ctx.from.is_premium ? Strings.varYes : Strings.varNo;
  const userLang = ctx.from.language_code || Strings.unKnown;

  userInfoTemplate = userInfoTemplate
    .replace('{userName}', userName)
    .replace('{userId}', userId)
    .replace('{userHandle}', userHandle)
    .replace('{isBot}', isBot)
    .replace('{userPremium}', userPremium)
    .replace('{userLang}', userLang);

  return userInfoTemplate;
}

async function getChatInfo(ctx) {
  const Strings = getStrings(ctx.from.language_code);
  if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    let chatInfoTemplate = Strings.chatInfo;

    const chatId = ctx.chat.id || Strings.unKnown;
    const chatName = ctx.chat.title;
    const chatHandle = ctx.chat.username ? `@${ctx.chat.username}` : Strings.varNone;
    const chatType = ctx.chat.type || Strings.unKnown;
    
    const chatMembersCount = await ctx.telegram.getChatMembersCount(chatId);
    const isForum = ctx.chat.is_forum ? Strings.varYes : Strings.varNo;
    
    chatInfoTemplate = chatInfoTemplate
      .replace('{chatId}', chatId)
      .replace('{chatName}', chatName)
      .replace('{chatHandle}', chatHandle)
      .replace('{chatMembersCount}', chatMembersCount)
      .replace('{chatType}', chatType)
      .replace('{isForum}', isForum);
    
    return chatInfoTemplate;
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

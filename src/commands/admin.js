const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

async function collectInfo(ctx) {
  const Strings = getStrings(ctx.from.language_code);
  const chatId = ctx.chat.id || Strings.unKnown;
  const adminId = ctx.from.id || Strings.unKnown;
  const userId = parseInt(ctx.message.text.split(' ')[1], 10);
  const admins = await ctx.telegram.getChatAdministrators(chatId);
  const isAdmin = admins.some(admin => admin.user.id === adminId);
  const onCrew = JSON.parse("[" + process.env.botAdmins + "]");

  return { Strings, chatId, userId, isAdmin, onCrew };
}

async function handleMember(ctx, action, successMessage, errorMessage) {
  const { Strings, chatId, userId, isAdmin, onCrew } = await collectInfo(ctx);

  if (onCrew || isAdmin) {
    if (isNaN(userId)) {
      return ctx.reply(Strings.invalidId, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      });
    }
    try {
      await action(chatId, userId);
      const report = successMessage.replace('{userId}', userId);
      ctx.reply(report, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      });
    } catch (err) {
      const error = errorMessage.replace('{tgErr}', err.message);
      ctx.reply(error, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      });
    }
  } else {
    ctx.reply(Strings.noPermission, {
      parse_mode: 'Markdown',
      reply_to_message_id: ctx.message.message_id
    });
  }
}

module.exports = (bot) => {
  bot.command('ban', spamwatchMiddleware, (ctx) => {
    handleMember(ctx, (chatId, userId) => ctx.telegram.kickChatMember(chatId, userId),
      getStrings(ctx.from.language_code).banSuccess,
      getStrings(ctx.from.language_code).banErr
    );
  });

  bot.command('unban', spamwatchMiddleware, (ctx) => {
    handleMember(ctx, (chatId, userId) => ctx.telegram.unbanChatMember(chatId, userId),
      getStrings(ctx.from.language_code).unBanSuccess,
      getStrings(ctx.from.language_code).unBanErr
    );
  });
};

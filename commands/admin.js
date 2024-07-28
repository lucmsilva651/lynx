const Config = require('../props/config.json');
const { getStrings } = require('../plugins/checklang.js');

async function collectInfo(ctx) {
  const Strings = getStrings(ctx.from.language_code);
  const chatId = ctx.chat.id || Strings.unKnown;
  const userId = ctx.from.id || Strings.unKnown;
  const banId = parseInt(ctx.message.text.split(' ')[1], 10);
  const admins = await ctx.telegram.getChatAdministrators(chatId);
  const isAdmin = admins.some(admin => admin.user.id === userId);
  const onCrew = Config.admins.includes(userId);

  return { Strings, chatId, banId, isAdmin, onCrew };
}

module.exports = (bot) => {
  bot.command('lynxban', async (ctx) => {
    const info = await collectInfo(ctx);
    const { Strings, chatId, banId, isAdmin, onCrew } = info;

    if (onCrew || isAdmin) {
      if (banId === NaN) {
        return ctx.reply(
          Strings.banInvalidId, {
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id
          }
        );
      } else {
        try {
          await ctx.telegram.kickChatMember(chatId, banId);
          const banReport = Strings.banSuccess.replace('{banId}', banId);
          ctx.reply(
            banReport, {
              parse_mode: 'Markdown',
              reply_to_message_id: ctx.message.message_id
            }
          );
        } catch (err) {
          const banErr = Strings.banErr.replace('{tgErr}', err);
          ctx.reply(
            banErr, {
              parse_mode: 'Markdown',
              reply_to_message_id: ctx.message.message_id
            }
          );
        };
      };
    } else {
      ctx.reply(
        Strings.noPermission, {
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id
        }
      );
    };
  });
};
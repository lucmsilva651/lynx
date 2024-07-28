const Config = require('../props/config.json');
const { getStrings } = require('../plugins/checklang.js');

async function collectInfo(ctx) {
  const Strings = getStrings(ctx.from.language_code);
  const chatId = ctx.chat.id || Strings.unKnown;
  const adminId = ctx.from.id || Strings.unKnown;
  const userId = parseInt(ctx.message.text.split(' ')[1], 10);
  const admins = await ctx.telegram.getChatAdministrators(chatId);
  const isAdmin = admins.some(admin => admin.user.id === adminId);
  const onCrew = Config.admins.includes(adminId);

  return { Strings, chatId, userId, isAdmin, onCrew };
}

module.exports = (bot) => {
  bot.command('ban', async (ctx) => {
    const info = await collectInfo(ctx);
    const { Strings, chatId, userId, isAdmin, onCrew } = info;

    if (onCrew || isAdmin) {
      if (userId === NaN) {
        return ctx.reply(
          Strings.invalidId, {
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id
          }
        );
      } else {
        try {
          await ctx.telegram.kickChatMember(chatId, userId);
          const banReport = Strings.banSuccess.replace('{userId}', userId);
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

  bot.command('unban', async (ctx) => {
    const info = await collectInfo(ctx);
    const { Strings, chatId, userId, isAdmin, onCrew } = info;

    if (onCrew || isAdmin) {
      if (userId === NaN) {
        return ctx.reply(
          Strings.invalidId, {
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id
          }
        );
      } else {
        try {
          await ctx.telegram.unbanChatMember(chatId, userId);
          const unBanReport = Strings.unBanSuccess.replace('{userId}', userId);
          ctx.reply(
            unBanReport, {
              parse_mode: 'Markdown',
              reply_to_message_id: ctx.message.message_id
            }
          );
        } catch (err) {
          const unBanErr = Strings.unBanErr.replace('{tgErr}', err);
          ctx.reply(
            unBanErr, {
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
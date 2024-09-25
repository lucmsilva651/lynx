const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

async function sendHelpMessage(ctx, isEditing) {
  const Strings = getStrings(ctx.from.language_code);
  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: Strings.mainCommands, callback_data: '1' }, { text: Strings.usefulCommands, callback_data: '2' }],
        [{ text: Strings.interactiveEmojis, callback_data: '3' }, { text: Strings.funnyCommands, callback_data: '4' }],
        [{ text: Strings.lastFm, callback_data: '5' }]
      ]
    }
  };
  const helpText = Strings.lynxHelp;
  if (isEditing) {
    await ctx.editMessageText(helpText, options);
  } else {
    await ctx.reply(helpText, options);
  }
}

module.exports = (bot) => {
  bot.help(spamwatchMiddleware, async (ctx) => {
    await sendHelpMessage(ctx);
  });

  bot.on('callback_query', async (ctx) => {
    const callbackData = ctx.callbackQuery.data;
    const Strings = getStrings(ctx.from.language_code);
    const options = {
      parse_mode: 'Markdown',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: Strings.goBack, callback_data: '6' }],
        ]
      })
    };

    switch (callbackData) {
      case '1':
        await ctx.answerCbQuery();
        await ctx.editMessageText(Strings.mainCommandsDesc, options);
        break;
      case '2':
        await ctx.answerCbQuery();
        await ctx.editMessageText(Strings.usefulCommandsDesc, options);
        break;
      case '3':
        await ctx.answerCbQuery();
        await ctx.editMessageText(Strings.interactiveEmojisDesc, options);
        break;
      case '4':
        await ctx.answerCbQuery();
        await ctx.editMessageText(Strings.funnyCommandsDesc, options);
        break;
      case '5':
        await ctx.answerCbQuery();
        await ctx.editMessageText(Strings.lastFmDesc, options);
        break;
      case '6':
        await ctx.answerCbQuery();
        await sendHelpMessage(ctx, true);
        break;
      default:
        await ctx.answerCbQuery(Strings.invalidOption);
        break;
    }
  });
}
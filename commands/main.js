const resources = require('../props/resources.json');
const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

async function sendHelpMessage(ctx, isEditing) {
  const Strings = getStrings(ctx.from.language_code);
  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: Strings.information, callback_data: '1' }, { text: Strings.check, callback_data: '2' }],
        [{ text: Strings.intemojis, callback_data: '3' }, { text: Strings.botinfo, callback_data: '4' }]
      ]
    }
  };
  const helpText = Strings.lynxHelp;
  if(isEditing){
    await ctx.editMessageText(helpText, options);
  }else{
    await ctx.reply(helpText, options);
  }
}

module.exports = (bot) => {
  bot.start(spamwatchMiddleware, async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    ctx.replyWithPhoto(
      resources.lunaCat, {
        caption: Strings.lynxWelcome,
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      }
    );
  });

  bot.help(spamwatchMiddleware, async (ctx) => {
    await sendHelpMessage(ctx);
  });

  bot.on('callback_query', async (ctx) => {
    const callbackData = ctx.callbackQuery.data;
    const Strings = getStrings(ctx.from.language_code);
    const options = {reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: Strings.goback, callback_data: '5' }],
      ]})
    };
    switch (callbackData) {
      case '1':
        await ctx.answerCbQuery();
        await ctx.editMessageText(Strings.informationHelp, options);
        break;
      case '2':
        await ctx.answerCbQuery();
        await ctx.editMessageText(Strings.funnyChecksHelp, options);
        break;
      case '3':
        await ctx.answerCbQuery();
        await ctx.editMessageText(Strings.interactiveEmojisHelp, options);
        break;
      case '4':
        await ctx.answerCbQuery();
        await ctx.editMessageText(Strings.botInfoHelp, options);
        break;
      case '5':
        await ctx.answerCbQuery();
        await sendHelpMessage(ctx, true);
        break;
      default:
        await ctx.answerCbQuery('Woops! Invalid option');
        break;
    }
  });

  bot.command('privacy', spamwatchMiddleware, async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    ctx.reply(
      Strings.lynxPrivacy, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_to_message_id: ctx.message.message_id
      }
    );
  });
};
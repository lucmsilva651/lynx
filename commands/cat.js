const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

module.exports = (bot) => {
  bot.command("cat", spamwatchMiddleware, async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    const userInput = ctx.message.text.split(' ').slice(1).join(' ').replace(/\s+/g, '');
    let request = "";

    if (userInput && userInput.includes("gif")) {
      request = `/gif${userInput.replace("gif", "")}`;
      const apiUrl = `https://cataas.com/cat${request}`;

      try {
        await ctx.replyWithAnimation(apiUrl, {
          caption: `🐱`,
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id
        });
      } catch (error) {
        ctx.reply(Strings.catGifErr, {
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id
        });
      };
    } else {
      request = userInput ? `/${userInput}` : '';
      const apiUrl = `https://cataas.com/cat${request}`;

      try {
        await ctx.replyWithPhoto(apiUrl, {
          caption: `🐱`,
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id
        });
      } catch (error) {
        ctx.reply(Strings.catImgErr, {
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id
        });
      };
    };
  });

  bot.command("httpcat", spamwatchMiddleware, async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    const userInput = ctx.message.text.split(' ').slice(1).join(' ').replace(/\s+/g, '');
    
    if (!userInput || isNaN(userInput)) {
      return ctx.reply(Strings.catImgErr, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      });
    }

    const apiUrl = `https://http.cat/${userInput}`;

    try {
      await ctx.replyWithPhoto(apiUrl, {
        caption: `🐱 ${apiUrl}`,
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      });
    } catch (error) {
      ctx.reply(Strings.catImgErr, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      });
    }
  });
};

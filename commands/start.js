const resources = require('../props/resources.json');
const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

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
};
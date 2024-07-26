const resources = require('../props/resources.json');
const { getStrings } = require('./checklang');

module.exports = (bot) => {
  bot.start((ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    ctx.replyWithPhoto(
      resources.lynxProfilePhoto, {
        caption: Strings.lynxWelcome,
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      }
    );
  });
};
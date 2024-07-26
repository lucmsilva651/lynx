const { getStrings } = require('../plugins/checklang.js');
const resources = require('../props/resources.json');

module.exports = (bot) => {
  bot.help((ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    ctx.replyWithPhoto(
      resources.lunaCat2, {
        caption: Strings.lynxHelp,
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      }
    );
  });
};
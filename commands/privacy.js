const { getStrings } = require('./checklang.js');

module.exports = (bot) => {
  bot.command('privacy', (ctx) => {
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
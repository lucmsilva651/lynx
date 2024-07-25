const Strings = require('../locales/english.json');

module.exports = (bot) => {
  bot.command('privacy', (ctx) => {
    ctx.reply(
      Strings.lynxPrivacy, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_to_message_id: ctx.message.message_id
      }
    );
  });
};
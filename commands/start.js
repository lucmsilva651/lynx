const Strings = require('../locales/english.json');
const resources = require('../props/resources.json');

module.exports = (bot) => {
  bot.start((ctx) => {
    ctx.replyWithPhoto(
      resources.lynxProfilePhoto, {
        caption: Strings.lynxWelcome,
        parse_mode: 'Markdown'
      }
    );
  });
};
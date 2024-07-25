const Strings = require('../locales/english.json');
const resources = require('../props/resources.json');

module.exports = (bot) => {
  bot.help((ctx) => {
    ctx.replyWithPhoto(
      resources.lynxFullPhoto, {
        caption: Strings.lynxHelp,
        parse_mode: 'Markdown'
      }
    );
  });
};
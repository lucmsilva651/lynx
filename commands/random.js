const Strings = require('../locales/english.json');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = (bot) => {
  bot.command('random', (ctx) => {
    const randomValue = getRandomInt(11);
    const randomVStr = Strings.randomNum.replace('{number}', randomValue);

    ctx.reply(
      randomVStr, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      }
    );
  });
};
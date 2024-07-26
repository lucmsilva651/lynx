const { getStrings } = require('../plugins/checklang.js');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = (bot) => {
  bot.command('random', (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
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
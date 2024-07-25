const Strings = require('../locales/english.json');
const resources = require('../props/resources.json');

function furryFunction(ctx) {
  if (Math.random() < 0.5 ? "yes" : "no" === "yes") {
    ctx.replyWithAnimation(
      resources.furryGif, {
        caption: Strings.isFurry,
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      }
    );
  } else {
    ctx.reply(
      Strings.isNtFurry, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      }
    );
  }
}

function gayFunction(ctx) {
  if (Math.random() < 0.5 ? "yes" : "no" === "yes") {
    ctx.replyWithAnimation(
      resources.gayFlag, {
        caption: Strings.isGay,
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      }
    );
  } else {
    ctx.reply(
      Strings.isNtGay, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      }
    );
  }
}

module.exports = (bot) => {
  bot.command('furry', (ctx) => {
    furryFunction(ctx);
  });

  bot.command('gay', (ctx) => {
    gayFunction(ctx);
  });
};
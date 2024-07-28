const resources = require('../props/resources.json');
const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

function furryFunction(ctx) {
  const Strings = getStrings(ctx.from.language_code);
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
  const Strings = getStrings(ctx.from.language_code);
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
  bot.command('dice', spamwatchMiddleware, async (ctx) => {
    ctx.telegram.sendDice(
      ctx.chat.id, {
        reply_to_message_id: ctx.message.message_id
      }
    );
  });

  bot.command('slot', spamwatchMiddleware, async (ctx) => {
    ctx.telegram.sendDice(
      ctx.chat.id, {
        emoji: '🎰',
        reply_to_message_id: ctx.message.message_id
      }
    );
  });

  bot.command('furry', spamwatchMiddleware, async (ctx) => {
    furryFunction(ctx);
  });

  bot.command('gay', spamwatchMiddleware, async (ctx) => {
    gayFunction(ctx);
  });
};
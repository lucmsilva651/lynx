const resources = require('../props/resources.json');
const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

function sendRandomReply(ctx, gifUrl, textKey, notTextKey) {
  const Strings = getStrings(ctx.from.language_code);
  const shouldSendGif = Math.random() < 0.5;

  if (shouldSendGif) {
    ctx.replyWithAnimation(gifUrl, {
      caption: Strings[textKey],
      parse_mode: 'Markdown',
      reply_to_message_id: ctx.message.message_id
    }).catch(err => {
      gifErr = gifErr.replace('{err}', err);
      
      ctx.reply(Strings.gifErr, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id
      });
    });
  } else {
    ctx.reply(Strings[notTextKey], {
      parse_mode: 'Markdown',
      reply_to_message_id: ctx.message.message_id
    });
  }
}


async function handleDiceCommand(ctx, emoji, delay) {
  const Strings = getStrings(ctx.from.language_code);
  
  const result = await ctx.sendDice({ emoji, reply_to_message_id: ctx.message.message_id });
  const botResponse = Strings.funEmojiResult
    .replace('{emoji}', result.dice.emoji)
    .replace('{value}', result.dice.value);

  setTimeout(() => {
    ctx.reply(botResponse, {
      parse_mode: 'Markdown',
      reply_to_message_id: ctx.message.message_id
    });
  }, delay);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = (bot) => {
  bot.command('random', spamwatchMiddleware, async (ctx) => {
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

  bot.command('dice', spamwatchMiddleware, async (ctx) => {
    await handleDiceCommand(ctx, undefined, 4000);
  });

  bot.command('slot', spamwatchMiddleware, async (ctx) => {
    await handleDiceCommand(ctx, '🎰', 3000);
  });

  bot.command('ball', spamwatchMiddleware, async (ctx) => {
    await handleDiceCommand(ctx, '⚽', 3000);
  });

  bot.command('dart', spamwatchMiddleware, async (ctx) => {
    await handleDiceCommand(ctx, '🎯', 3000);
  });

  bot.command('bowling', spamwatchMiddleware, async (ctx) => {
    await handleDiceCommand(ctx, '🎳', 3000);
  });

  bot.command('idice', spamwatchMiddleware, async (ctx) => {
    const stickerId = "CAACAgQAAxkBAAJxjWbSSP-8ZNEhEpAJjQsHsGf-UuEPAAJCAAPI-uwTAAEBVWWh4ucINQQ";
    ctx.replyWithSticker(stickerId, {
      reply_to_message_id: ctx.message.message_id
    });
  });

  bot.command('furry', spamwatchMiddleware, async (ctx) => {
    sendRandomReply(ctx, resources.furryGif, 'isFurry', 'isNtFurry');
  });

  bot.command('gay', spamwatchMiddleware, async (ctx) => {
    sendRandomReply(ctx, resources.gayFlag, 'isGay', 'isNtGay');
  });
};

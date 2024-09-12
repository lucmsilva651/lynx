const resources = require('../props/resources.json');
const fs = require('fs');
const path = require('path');
const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

module.exports = (bot) => {
  bot.start(spamwatchMiddleware, async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    ctx.replyWithPhoto(
      resources.lunaCat, {
      caption: Strings.lynxWelcome,
      parse_mode: 'Markdown',
      reply_to_message_id: ctx.message.message_id
    }
    );
  });

  bot.command('privacy', spamwatchMiddleware, async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    ctx.reply(
      Strings.lynxPrivacy, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      reply_to_message_id: ctx.message.message_id
    }
    );
  });

  bot.on('message', (msg) => {
    const userName = msg.from.first_name;
    const userId = msg.from.id;
    const messageText = msg.text;
    const logMessages = path.resolve(__dirname, '../props/messages.log');
    const logData = `INFO: User ${userName}, ${userId} sent a command or message with the content: ${messageText}\n`
    fs.appendFile(logMessages, logData, (err) => {
      if (err) {
        console.error('Erro ao gravar no arquivo de log:', err);
      }});
  }); 
};
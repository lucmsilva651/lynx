const { Telegraf } = require('telegraf');
const Config = require('./props/config.json');
const { isOnSpamWatch } = require('./plugins/lib-spamwatch/spamwatch.js');

const bot = new Telegraf(Config.botToken);

const loadCommands = () => {
  const fs = require('fs');
  const path = require('path');
  const commandsPath = path.join(__dirname, 'commands');

  fs.readdirSync(commandsPath).forEach((file) => {
    const command = require(path.join(commandsPath, file));
    if (typeof command === 'function') {
      command(bot, isOnSpamWatch);
    }
  });
};

loadCommands();

bot.launch().then(() => {
  console.log('Bot está rodando...');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

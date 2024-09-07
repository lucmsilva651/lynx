const { Telegraf } = require('telegraf');
const path = require('path');
const fs = require('fs');
const Config = require('./props/config.json');
const { isOnSpamWatch } = require('./plugins/lib-spamwatch/spamwatch.js');

const bot = new Telegraf(Config.botToken);
const MAX_RETRIES = 5;
let restartCount = 0;


const loadCommands = () => {
  const commandsPath = path.join(__dirname, 'commands');

  try {
    fs.readdirSync(commandsPath).forEach((file) => {
      try {
        const command = require(path.join(commandsPath, file));
        if (typeof command === 'function') {
          command(bot, isOnSpamWatch);
        }
      } catch (fileError) {
        console.error(`Failed to load command file ${file}: ${fileError.message}`);
      }
    });
  } catch (dirError) {
    console.error(`Failed to read commands directory: ${dirError.message}`);
  }
};


const sendMessage = async (ctx, text, options = {}) => {
  try {
    await ctx.reply(text, options);
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
};

const startBot = async () => {
  try {
    await bot.launch();
    console.log('Bot is running...');
    restartCount = 0;
  } catch (error) {
    console.error('Failed to start bot:', error.message);
    if (restartCount < MAX_RETRIES) {
      restartCount++;
      console.log(`Retrying to start bot... Attempt ${restartCount}`);
      setTimeout(startBot, 5000);
    } else {
      console.error('Maximum retry attempts reached. Exiting.');
      process.exit(1);
    }
  }
};

const handleShutdown = (signal) => {
  console.log(`Received ${signal}. Stopping bot...`);
  bot.stop(signal).then(() => {
    console.log('Bot stopped.');
    process.exit(0);
  });
};

process.once('SIGINT', () => handleShutdown('SIGINT'));
process.once('SIGTERM', () => handleShutdown('SIGTERM'));

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

loadCommands();
startBot();

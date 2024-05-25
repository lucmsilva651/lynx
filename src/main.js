const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const token = process.env.TGBOT_TOKEN; // config.env
const bot = new TelegramBot(token, { polling: true });

const commandsPath = path.join(__dirname, 'commands')
const commandHandlers = {};

// load all commands
fs.readdirSync(commandsPath).forEach(file => {
  const command = `/${path.parse(file).name}`;
  const handler = require(path.join(commandsPath,file));
  commandHandlers[command] = handler;
})

bot.on('message', (msg) => {
  const messageText = msg.text;
  if (commandHandlers[messageText]) {
    commandHandlers[messageText](bot, msg);
  }
});

const date = Date();
console.log(`INFO: Lynx started at ${date}\n`)
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const logMessage = require('./logger');
const token = process.env.TGBOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const commandsPath = path.join(__dirname, 'commands');
const commandHandlers = {};

fs.readdirSync(commandsPath).forEach(file => {
  const command = `/${path.parse(file).name}`;
  const handler = require(path.join(commandsPath, file));
  commandHandlers[command] = handler;
});

bot.on('message', (msg) => {
  const messageText = msg.text;
  if (commandHandlers[messageText]) {
    commandHandlers[messageText](bot, msg);
  }
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

const date = new Date().toString();
console.log(`INFO: Lynx started\n`);

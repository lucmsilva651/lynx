const winston = require('winston');
const path = require('path');

const logFile = path.resolve(__dirname, '../props/bot.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFile })
  ]
});

console.log = (message) => {
  logger.info(message);
};

console.error = (message) => {
  logger.error(message);
};

console.warn = (message) => {
  logger.warn(message);
};

console.info = (message) => {
  logger.info(message);
};

module.exports = logger;

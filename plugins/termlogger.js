const winston = require('winston');
const path = require('path');

const logFile = path.resolve(__dirname, '../props/bot.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ message }) => {
      return `${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: logFile,
      format: winston.format.printf(({ timestamp, message }) => {
        return `[${timestamp}]\n${message}\n`;
      })
    })
  ]
});

console.log = (message) => logger.info(message);
console.error = (message) => logger.error(message);
console.warn = (message) => logger.warn(message);
console.info = (message) => logger.info(message);

module.exports = logger;

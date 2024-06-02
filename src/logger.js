const fs = require('fs');
const util = require('util');

const logFile = 'log.txt';
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
};

const logMessage = async (message) => {
    const timestamp = getFormattedDate();
    const formattedMessage = `${timestamp} ${util.format(message)}`;
    
    process.stdout.write(formattedMessage + '\n');
    
    return new Promise((resolve, reject) => {
        logStream.write(formattedMessage + '\n', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

console.log = (message) => {
    logMessage(message).catch(err => {
        process.stderr.write(`WARN: Error writing to log: ${err}\n`);
    });
};

module.exports = logMessage;

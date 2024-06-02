const fs = require('fs');
const path = require('path');

const blocklistPath = path.join(__dirname, '../blocklist.txt');

let blocklist = [];

const readBlocklist = () => {
  try {
    const data = fs.readFileSync(blocklistPath, 'utf8');
    blocklist = data.split('\n').map(id => id.trim()).filter(id => id !== '');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('WARN: Blocklist file not found. Creating a new one.');
      fs.writeFileSync(blocklistPath, '');
    } else {
      console.error('WARN: Error reading blocklist:', error);
    }
  }
};

const isBlocked = (userId) => {
  return blocklist.includes(String(userId));
};

readBlocklist();

module.exports = { isBlocked };

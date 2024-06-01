const os = require('os');

module.exports = function (bot, msg) {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;
  const userId = msg.from.id;

  function formatUptime(uptime) {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function getSystemInfo() {
    const platform = os.platform();
    const release = os.release();
    const cpuModel = os.cpus()[0].model;
    const cpuCores = os.cpus().length;
    const totalMemory = (os.totalmem() / (1024 ** 3)).toFixed(2) + ' GB';
    const freeMemory = (os.freemem() / (1024 ** 3)).toFixed(2) + ' GB';
    const uptime = formatUptime(os.uptime());

    return `📊 *Server Stats*\n\n` +
      `*OS:* ${platform} ${release}\n` +
      `*CPU:* ${cpuModel} (${cpuCores} cores)\n` +
      `*RAM:* ${freeMemory} / ${totalMemory}\n` +
      `*Uptime:* ${uptime}`;
  }

  const message = getSystemInfo();

  bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
    .catch(error => console.error('ERROR: Message cannot be sent:', error));

  console.log(`INFO: /stats executed by ${userName}, ${userId}`);
};

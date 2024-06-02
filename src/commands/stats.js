const os = require('os');

module.exports = function (bot, msg) {
  const chatId = msg.chat.id;
  const admins = process.env.TGBOT_ADMINS;

  function formatUptime(uptime) {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function getSystemInfo() {
    const platform = os.platform();
    const release = os.release();
    const arch = os.arch();
    const cpuModel = os.cpus()[0].model;
    const cpuCores = os.cpus().length;
    const totalMemory = (os.totalmem() / (1024 ** 3)).toFixed(2) + ' GB';
    const freeMemory = (os.freemem() / (1024 ** 3)).toFixed(2) + ' GB';
    const loadAverage = os.loadavg().map(avg => avg.toFixed(2)).join(', ');
    const uptime = formatUptime(os.uptime());
    const nodeVersion = process.version;
    const homeDir = os.homedir();
    const hostName = os.hostname();
    const tempDir = os.tmpdir();
    const userInfo = os.userInfo();

    return `*Server Stats*\n\n` +
      `*OS:* \`${platform} ${release}\`\n` +
      `*Arch:* \`${arch}\`\n` +
      `*Node.js Version:* \`${nodeVersion}\`\n` +
      `*CPU:* \`${cpuModel}\`\n` +
      `*CPU Cores:* \`${cpuCores} cores\`\n` +
      `*RAM:* \`${freeMemory} / ${totalMemory}\`\n` +
      `*Load Average:* \`${loadAverage}\`\n` +
      `*Uptime:* \`${uptime}\`\n\n` +
      `*Username*: \`${userInfo.username}\`\n` +
      `*Hostname:* \`${hostName}\`\n` +
      `*Home Directory:* \`${homeDir}\`\n` +
      `*Temp. Directory:* \`${tempDir}\``;
  }

  const message = getSystemInfo();

  const isAdmin = admins.includes(msg.from.id.toString());
  if (isAdmin) {
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })
      .catch(error => console.error('WARN: Message cannot be sent: ', error));
  } else {
    return;
  }
}

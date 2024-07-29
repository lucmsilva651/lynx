// specific commands to the crew
const Config = require('../props/config.json');
const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);
const os = require('os');

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

  return `*Server Stats*\n\n` +
    `*OS:* \`${platform} ${release}\`\n` +
    `*Arch:* \`${arch}\`\n` +
    `*Node.js Version:* \`${nodeVersion}\`\n` +
    `*CPU:* \`${cpuModel}\`\n` +
    `*CPU Cores:* \`${cpuCores} cores\`\n` +
    `*RAM:* \`${freeMemory} / ${totalMemory}\`\n` +
    `*Load Average:* \`${loadAverage}\`\n` +
    `*Uptime:* \`${uptime}\`\n\n`;
}

module.exports = (bot) => {
  bot.command('getbotstats', spamwatchMiddleware, async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    const userId = ctx.from.id || Strings.unKnown;
    if (Config.admins.includes(userId)) {
      const machineStats = getSystemInfo();
      ctx.reply(
        machineStats, {
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id
        }
      ).catch(error => ctx.reply(
        "Error when getting server status:\n" + error, {
          reply_to_message_id: ctx.message.message_id
        }
      ));
    } else {
      ctx.reply(Strings.botAdminOnly, {
        reply_to_message_id: ctx.message.message_id
      });
    }
  });

  bot.command('setbotname', spamwatchMiddleware, async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    const userId = ctx.from.id || Strings.unKnown;
    if (Config.admins.includes(userId)) {
      const botName = ctx.message.text.split(' ').slice(1).join(' ');
      const botNameReport = Strings.botNameChanged.replace('{botName}', botName);
      ctx.telegram.setMyName(botName).catch(error => ctx.reply(
        "Error when changing bot name:\n" + error, {
          reply_to_message_id: ctx.message.message_id
        }
      ));
      ctx.reply(
        botNameReport, {
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id
        }
      );
    } else {
      ctx.reply(Strings.botAdminOnly, {
        reply_to_message_id: ctx.message.message_id
      });
    }
  });

  bot.command('setbotdesc', spamwatchMiddleware, async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    const userId = ctx.from.id || Strings.unKnown;
    if (Config.admins.includes(userId)) {
      const botDesc = ctx.message.text.split(' ').slice(1).join(' ');
      const botDescReport = Strings.botDescChanged.replace('{botDesc}', botDesc);
      ctx.telegram.setMyDescription(botDesc).catch(error => ctx.reply(
        "Error when changing bot description:\n" + error, {
          reply_to_message_id: ctx.message.message_id
        }
      ));
      ctx.reply(
        botDescReport, {
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id
        }
      );
    } else {
      ctx.reply(
        Strings.botAdminOnly, {
          reply_to_message_id: ctx.message.message_id
      });
    }
  });
};
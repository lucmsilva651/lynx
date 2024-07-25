const Strings = require('../locales/english.json');
const Config = require('../props/config.json');
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

// Função para obter informações do usuário
async function getUserInfo(ctx) {
  let userInfoTemplate = Strings.userInfo;

  const userName = ctx.from.first_name || Strings.unKnown;
  const userId = ctx.from.id || Strings.unKnown;
  const userHandle = ctx.from.username ? `@${ctx.from.username}` : Strings.varNone;
  const isBot = ctx.from.is_bot ? Strings.varYes : Strings.varNo;
  const userPremium = ctx.from.is_premium ? Strings.varYes : Strings.varNo;
  const userLang = ctx.from.language_code || Strings.unKnown;

  userInfoTemplate = userInfoTemplate
    .replace('{userName}', userName)
    .replace('{userId}', userId)
    .replace('{userHandle}', userHandle)
    .replace('{isBot}', isBot)
    .replace('{userPremium}', userPremium)
    .replace('{userLang}', userLang);

  return userInfoTemplate;
}

// Função para obter informações do chat
async function getChatInfo(ctx) {
  if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    let chatInfoTemplate = Strings.chatInfo;

    const chatId = ctx.chat.id || Strings.unKnown;
    const chatName = ctx.chat.title;
    const chatHandle = ctx.chat.username ? `@${ctx.chat.username}` : Strings.varNone;
    const chatType = ctx.chat.type || Strings.unKnown;
    
    const chatMembersCount = await ctx.telegram.getChatMembersCount(chatId);
    const isForum = ctx.chat.is_forum ? Strings.varYes : Strings.varNo;
    
    chatInfoTemplate = chatInfoTemplate
      .replace('{chatId}', chatId)
      .replace('{chatName}', chatName)
      .replace('{chatHandle}', chatHandle)
      .replace('{chatMembersCount}', chatMembersCount)
      .replace('{chatType}', chatType)
      .replace('{isForum}', isForum);
    
    return chatInfoTemplate;
  } else {
    return Strings.groupOnly;
  }
}

module.exports = (bot) => {
  bot.command('stats', (ctx) => {
    const userId = ctx.from.id || Strings.unKnown;
    if (Config.admins.includes(userId)) {
      const machineStats = getSystemInfo();
      ctx.reply(
        machineStats, {
          parse_mode: 'Markdown'
        }
      );
    } else {
      ctx.reply(Strings.noPermission);
    }
  });
  
  bot.command('chatinfo', async (ctx) => {
    const chatInfo = await getChatInfo(ctx);
    ctx.reply(
      chatInfo, {
        parse_mode: 'Markdown'
      }
    );
  });

  bot.command('userinfo', async (ctx) => {
    const userInfo = await getUserInfo(ctx);
    ctx.reply(
      userInfo, {
        parse_mode: 'Markdown'
      }
    );
  });
};

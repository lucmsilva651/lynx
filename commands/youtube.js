const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const ytDlpPaths = {
  linux: path.resolve(__dirname, '../plugins/yt-dlp/yt-dlp'),
  win32: path.resolve(__dirname, '../plugins/yt-dlp/yt-dlp.exe'),
  darwin: path.resolve(__dirname, '../plugins/yt-dlp/yt-dlp_macos'),
};

function getYtDlpPath() {
  const platform = os.platform();
  return ytDlpPaths[platform] || ytDlpPaths.linux;
};

async function downloadFromYoutube(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};

module.exports = (bot) => {
  bot.command('yt', spamwatchMiddleware, async (ctx) => {
    const strings = getStrings(ctx.from.language_code);
    const ytDlpPath = getYtDlpPath();
    const userId = ctx.from.id;
    const videoUrl = ctx.message.text.split(' ').slice(1).join(' ');

    const mp4File = `tmp/${userId}.mp4`;
    const cmdArgs = "--max-filesize 2G --no-playlist --merge-output-format mp4 -o";
    const videoFormat = "-f bestvideo+bestaudio";
    const dlpCommand = `${ytDlpPath} ${videoUrl} ${videoFormat} ${cmdArgs} ${mp4File}`;

    const downloadingMessage = await ctx.reply(strings.ytDownloading, {
      parse_mode: 'Markdown',
      reply_to_message_id: ctx.message.message_id,
    });

    try {
      await downloadFromYoutube(dlpCommand);

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        downloadingMessage.message_id,
        null,
        strings.ytUploading, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      });

      if (fs.existsSync(mp4File)) {
        const userId = parseInt(ctx.match[2]);
        const userName = ctx.from.first_name;
        const message = strings.ytUploadDesc
          .replace("{userId}", userId)
          .replace("{userName}", userName);

        await ctx.replyWithVideo({
          source: mp4File,
          caption: `${message}`,
          parse_mode: 'Markdown'
        });

        fs.unlinkSync(mp4File);
      }
    } catch (error) {
      fs.unlinkSync(mp4File);
      const message = strings.ytDownloadErr
        .replace("{err}", error)
        .replace("{userName}", ctx.from.first_name);

      ctx.reply(message, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      });
    }
  });
};  
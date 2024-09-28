const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);
const { execFile } = require('child_process');
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

async function downloadFromYoutube(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
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
    const dlpCommand = ytDlpPath;
    const dlpArgs = [videoUrl, videoFormat, ...cmdArgs.split(' '), mp4File];

    const downloadingMessage = await ctx.reply(strings.ytDownloading, {
      parse_mode: 'Markdown',
      reply_to_message_id: ctx.message.message_id,
    });

    try {
      await downloadFromYoutube(dlpCommand, dlpArgs);

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        downloadingMessage.message_id,
        null,
        strings.ytUploading, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      });

      if (fs.existsSync(mp4File)) {
        const message = strings.ytUploadDesc
          .replace("{userId}", userId)
          .replace("{userName}", ctx.from.first_name);

        fs.stat(mp4File, async (err, stats) => {
          if (err) {
            console.error(err);
            return;
          };

          const mbSize = stats.size / (1024 * 1024);

          if (mbSize > 50) {
            await ctx.reply(strings.ytUploadLimit, {
              parse_mode: 'Markdown',
              reply_to_message_id: ctx.message.message_id,
            });

            fs.unlinkSync(mp4File);
          } else {
            try {
              await ctx.replyWithVideo({
                source: mp4File,
                caption: `${message}`,
                parse_mode: 'Markdown',
              });
            } catch (error) {
              await ctx.reply(`\`${error}\``, {
                parse_mode: 'Markdown',
                reply_to_message_id: ctx.message.message_id,
              });
            };
          };
        });
      };
    } catch (downloadError) {
      fs.unlinkSync(mp4File);
      const message = strings.ytDownloadErr
        .replace("{err}", error)
        .replace("{userName}", ctx.from.first_name);

      await ctx.reply(message, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      });
    }
  });
};

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

async function getApproxSize(command, videoUrl) {
  const args = [videoUrl, '--compat-opt', 'manifest-filesize-approx', '-O', 'filesize_approx'];

  return new Promise((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        const sizeInBytes = parseInt(stdout.trim(), 10);

        if (!isNaN(sizeInBytes)) {
          const sizeInMB = sizeInBytes / (1024 * 1024);
          resolve(sizeInMB);
        } else {
          reject(new Error('Invalid size received from yt-dlp'));
        }
      }
    });
  });
};

module.exports = (bot) => {
  bot.command(['yt', 'ytdl'], spamwatchMiddleware, async (ctx) => {
    const strings = getStrings(ctx.from.language_code);
    const ytDlpPath = getYtDlpPath();
    const userId = ctx.from.id;
    const videoUrl = ctx.message.text.split(' ').slice(1).join(' ');

    const mp4File = `tmp/${userId}.mp4`;
    const cmdArgs = "--max-filesize 2G --no-playlist --merge-output-format mp4 -o";
    const dlpCommand = ytDlpPath;

    const downloadingMessage = await ctx.reply(strings.ytDownloading, {
      parse_mode: 'Markdown',
      reply_to_message_id: ctx.message.message_id,
    });

    try {
      const approxSizeInMB = await getApproxSize(ytDlpPath, videoUrl);
      let videoFormat = "";

      if (approxSizeInMB >= 50) {
        videoFormat = `-f best`;
      } else {
        videoFormat = "-f bestvideo+bestaudio";
      }

      const dlpArgs = [videoUrl, videoFormat, ...cmdArgs.split(' '), mp4File];
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

        try {
          await ctx.replyWithVideo({
            source: mp4File,
            caption: `${message}`,
            parse_mode: 'Markdown',
          });

          await ctx.telegram.editMessageText(
            ctx.chat.id,
            downloadingMessage.message_id,
            null,
            strings.ytUploadLimit2, {
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id,
          });

          fs.unlinkSync(mp4File);
        } catch (error) {
          await ctx.reply(`\`${error}\``, {
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id,
          });
        }
      }
    } catch (error) {
      fs.unlinkSync(mp4File);
      let errStatus = "";

      if (error == "Error: 413: Request Entity Too Large") {
        errStatus = Strings.ytUploadLimit;
      } else {
        errStatus = error.error ? error.error.message : 'Unknown error';
      }
      
      const message = strings.ytDownloadErr
        .replace("{err}", errStatus)
        .replace("{userName}", ctx.from.first_name);

      await ctx.reply(message, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      });
    }
  });
};

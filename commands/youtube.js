const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);
const { execFile } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const ytDlpPaths = {
  win32: path.resolve(__dirname, '../plugins/yt-dlp/yt-dlp.exe'),
  darwin: path.resolve(__dirname, '../plugins/yt-dlp/yt-dlp_macos'),
};

function getYtDlpPath() {
  const platform = os.platform();
  if (platform === 'linux') {
    return 'yt-dlp';
  }
  return ytDlpPaths[platform] || 'yt-dlp';
}

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
}

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
}

function timeoutPromise(timeout) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout: Check took too long'));
    }, timeout);
  });
}

module.exports = (bot) => {
  bot.command(['yt', 'ytdl'], spamwatchMiddleware, async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    const ytDlpPath = getYtDlpPath();
    const userId = ctx.from.id;
    const videoUrl = ctx.message.text.split(' ').slice(1).join(' ');

    const mp4File = `tmp/${userId}.mp4`;
    const cmdArgs = "--max-filesize 2G --no-playlist --merge-output-format mp4 -o";
    const dlpCommand = ytDlpPath;

    const downloadingMessage = await ctx.reply(Strings.ytCheckingSize, {
      parse_mode: 'Markdown',
      reply_to_message_id: ctx.message.message_id,
    });

    if (fs.existsSync(ytDlpPath)) {
      try {
        const approxSizeInMB = await Promise.race([
          getApproxSize(ytDlpPath, videoUrl),
          timeoutPromise(5000)
        ]);

        let videoFormat = approxSizeInMB >= 50 ? `-f best` : "-f bestvideo+bestaudio";

        await ctx.telegram.editMessageText(
          ctx.chat.id,
          downloadingMessage.message_id,
          null,
          Strings.ytDownloading, {
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id,
        });

        const dlpArgs = [videoUrl, videoFormat, ...cmdArgs.split(' '), mp4File];
        await downloadFromYoutube(dlpCommand, dlpArgs);

        await ctx.telegram.editMessageText(
          ctx.chat.id,
          downloadingMessage.message_id,
          null,
          Strings.ytUploading, {
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id,
        });

        if (fs.existsSync(mp4File)) {
          const message = Strings.ytUploadDesc
            .replace("{userId}", userId)
            .replace("{userName}", ctx.from.first_name);

          try {
            await ctx.replyWithVideo({
              source: mp4File,
              caption: `${message}`,
              parse_mode: 'Markdown',
            });

            if (approxSizeInMB >= 50) {
              await ctx.telegram.editMessageText(
                ctx.chat.id,
                downloadingMessage.message_id,
                null,
                Strings.ytUploadLimit2, {
                parse_mode: 'Markdown',
                reply_to_message_id: ctx.message.message_id,
              });
            }

            fs.unlinkSync(mp4File);
          } catch (error) {
            await ctx.reply(`\`${error.message}\``, {
              parse_mode: 'Markdown',
              reply_to_message_id: ctx.message.message_id,
            });

            fs.unlinkSync(mp4File);
          }
        }
      } catch (error) {
        fs.unlinkSync(mp4File);
        let errStatus;

        if (error.message === "Error: 413: Request Entity Too Large") {
          errStatus = Strings.ytUploadLimit;
        } else {
          errStatus = error.message === 'Timeout: Check took too long'
            ? 'The check for video size timed out.'
            : error.error ? error.error.message : 'Unknown error';
        }

        const message = Strings.ytDownloadErr
          .replace("{err}", errStatus)
          .replace("{userName}", ctx.from.first_name);

        await ctx.reply(message, {
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id,
        });
      }
    } else {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        downloadingMessage.message_id,
        null,
        Strings.ytFileErr, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      });
    };
  });
};

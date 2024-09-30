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

const getYtDlpPath = () => {
  const platform = os.platform();
  return ytDlpPaths[platform] || ytDlpPaths.linux;
};

const downloadFromYoutube = async (command, args) => {
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

const getApproxSize = async (command, videoUrl) => {
  const args = [videoUrl, '--compat-opt', 'manifest-filesize-approx', '-O', 'filesize_approx'];
  try {
    const { stdout } = await downloadFromYoutube(command, args);
    const sizeInBytes = parseInt(stdout.trim(), 10);
    if (!isNaN(sizeInBytes)) {
      return sizeInBytes / (1024 * 1024);
    } else {
      throw new Error('Invalid size received from yt-dlp');
    }
  } catch (error) {
    throw error;
  }
};

const timeoutPromise = (timeout) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout: Check took too long'));
    }, timeout);
  });
};

module.exports = (bot) => {
  bot.command(['yt', 'ytdl'], spamwatchMiddleware, async (ctx) => {
    const strings = getStrings(ctx.from.language_code);
    const ytDlpPath = getYtDlpPath();
    const userId = ctx.from.id;
    const videoUrl = ctx.message.text.split(' ').slice(1).join(' ');

    const mp4File = `tmp/${userId}.mp4`;
    const cmdArgs = "--max-filesize 2G --no-playlist --cookies props/cookies.txt --merge-output-format mp4 -o";
    const dlpCommand = ytDlpPath;

    try {
      const downloadingMessage = await ctx.reply(strings.ytCheckingSize, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      });

      if (fs.existsSync(ytDlpPath)) {
        const approxSizeInMB = await Promise.race([
          getApproxSize(ytDlpPath, videoUrl),
          timeoutPromise(12000),
        ]);

        let videoFormat = approxSizeInMB >= 50 ? '-f best' : "-f bestvideo+bestaudio";

        await ctx.telegram.editMessageText(
          ctx.chat.id,
          downloadingMessage.message_id,
          null,
          strings.ytDownloading, {
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id,
          },
        );

        const dlpArgs = [videoUrl, videoFormat, ...cmdArgs.split(' '), mp4File];
        await downloadFromYoutube(dlpCommand, dlpArgs);

        await ctx.telegram.editMessageText(
          ctx.chat.id,
          downloadingMessage.message_id,
          null,
          strings.ytUploading, {
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id,
          },
        );

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

            if (approxSizeInMB >= 50) {
              await ctx.telegram.editMessageText(
                ctx.chat.id,
                downloadingMessage.message_id,
                null,
                strings.ytUploadLimit2, {
                  parse_mode: 'Markdown',
                  reply_to_message_id: ctx.message.message_id,
                },
              );
            }

            fs.unlinkSync(mp4File);
          } catch (error) {
            await ctx.reply(`\`${error.message}\``, {
              parse_mode: 'Markdown',
              reply_to_message_id: ctx.message.message_id,
            });

            fs.unlinkSync(mp4File);
          }
        } else {
          await ctx.reply(`\`${error.message}\``, {
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id,
          });
        }
      } else {
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          downloadingMessage.message_id,
          null,
          strings.ytFileErr, {
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id,
          },
        );
      }
    } catch (error) {
      console.error(error);
      await ctx.reply(`\`${error.message}\``, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      });
    }
  });
};
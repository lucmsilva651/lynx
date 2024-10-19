const { exec } = require('child_process');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const path = require('path');
const fs = require('fs');
const os = require('os');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);
const { getStrings } = require('../plugins/checklang.js');

const ffmpegPaths = {
    linux: '/usr/bin/ffmpeg',
    win32: path.resolve(__dirname, '../plugins/ffmpeg/ffmpeg.exe'),
  };

  const getFfmpegPath = () => {
    const platform = os.platform();
    return ffmpegPaths[platform] || ffmpegPaths.linux;
  };

async function getVideo(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr}`);
            } else {
                resolve(stdout.trim());
            }
        })
    })
}

module.exports = (bot) => {
    const ffmpegPath = getFfmpegPath();
    bot.command('getvideo', spamwatchMiddleware, async (ctx) => {
        const strings = getStrings(ctx.from.language_code);
        const userId = ctx.from.id;
        const mp4File = userId + '.f137.mp4';
        const webmFile = userId + '.f251.webm';
        const ffmpegCommand = 'cd tmp && ' + ffmpegPath + ' -i ' + mp4File + ' -i ' + webmFile + ' -c:v copy -c:a copy -strict -2 output.mp4';
        await getVideo(ffmpegCommand);
        const message = strings.ytUploadDesc
              .replace("{userId}", userId)
              .replace("{userName}", ctx.from.first_name);
        try {
            await ctx.replyWithVideo({
                source: 'tmp/output.mp4',
                caption: `${message}`,
                parse_mode: 'Markdown',
            });
        } catch (error) {
            ctx.reply(error, {
                parse_mode: 'Markdown',
                reply_to_message_id: ctx.message.message_id
            });
        }
        // Delete tmp folder
        fs.rmSync('tmp', { recursive: true, force: true })
    });
}
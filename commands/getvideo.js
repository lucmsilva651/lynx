const { exec } = require('child_process');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

function getVideo(command) {
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
    bot.command('getvideo', spamwatchMiddleware, async (ctx) => {
        const userId = ctx.from.id;
        const mp4File = userId + '.f137.mp4';
        const webmFile = userId + '.f251.webm';
        const ffmpegCommand = 'cd tmp && ffmpeg -i ' + mp4File + ' -i ' + webmFile + ' -c:v copy -c:a copy -strict -2 output.mp4';
        getVideo(ffmpegCommand);
        ctx.telegram.reply('Sending...');
        try {
            await ctx.replyWithVideo({
                source: 'tmp/output.mp4',
                caption: `${message}`,
                parse_mode: 'Markdown',
            });
        } catch (error) {
            ctx.reply(errorMessage.replace('{error}', error.message), {
                parse_mode: 'Markdown',
                reply_to_message_id: ctx.message.message_id
            });
        }
    });
}
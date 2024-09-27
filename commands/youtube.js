var exec = require('child_process').exec;
const fs = require('fs');
const { getStrings } = require('../plugins/checklang');

async function DownloadFromYoutube(command) {
    return new Promise((resolve, reject) => {

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stdout, stderr });
            } else {
                resolve({ error, stdout, stderr });
            }
        });
    });
}

module.exports = (bot) => {
    bot.command('yt', async (ctx) => {
        const Strings = getStrings(ctx.from.language_code);
        const args = ctx.message.text.split(' ').slice(1).join(' ');
        const ytCommand = 'yt-dlp ' + args + ' -o video.mp4';
        ctx.reply(Strings.downloading);
        await DownloadFromYoutube(ytCommand);
        try {
            ctx.reply(Strings.uploading);
            await ctx.replyWithVideo({ source: 'video.mp4' });
        } catch (error) {
            ctx.reply('Error!')
        }
        fs.unlinkSync('video.mp4');
    })
}
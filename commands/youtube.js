var exec = require('child_process').exec;
const fs = require('fs');

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
        const args = ctx.message.text.split(' ').slice(1).join(' ');
        const ytCommand = 'yt-dlp ' + args + ' -o video.mp4';
        await DownloadFromYoutube(ytCommand);
        try {
            await ctx.replyWithVideo({ source: 'video.mp4' });
        } catch (error) {
            console.log(error);
        }
        try {
            fs.unlinkSync('video.mp4');
        } catch (error) {
            console.log(error)
        }
    }
    )
}
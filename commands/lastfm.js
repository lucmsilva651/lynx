const axios = require('axios');
const Config = require('../props/config.json');
const { getStrings } = require('../plugins/checklang.js');
const { isOnSpamWatch } = require('../plugins/lib-spamwatch/spamwatch.js');
const spamwatchMiddleware = require('../plugins/lib-spamwatch/Middleware.js')(isOnSpamWatch);

module.exports = (bot) => {
  bot.command('lt', spamwatchMiddleware, async (ctx) => {
    const Strings = getStrings(ctx.from.language_code);
    const userInput = ctx.message.text.split(" ");
    const lastfmUser = userInput[1];

    if (!lastfmUser) {
      return ctx.reply(Strings.lastFmNoUser, {
        parse_mode: "Markdown",
        reply_to_message_id: ctx.message.message_id
      });
    };

    try {
      const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
        params: {
          method: 'user.getRecentTracks',
          user: lastfmUser,
          api_key: Config.lastKey,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': "lastfm-node"
        }
      });

      const track = response.data.recenttracks.track[0];

      if (!track) {
        const noResponse = Strings.lastFmNoResponse.replace('{lastfmUser}', lastfmUser);
        return ctx.reply(noResponse, {
          parse_mode: "Markdown",
          reply_to_message_id: ctx.message.message_id
        });
      };

      const trackName = track.name;
      const artistName = track.artist['#text'];
      const nowPlaying = track['@attr'] && track['@attr'].nowplaying ? Strings.lastFmListeningNow : Strings.lastFmLastPlayed;

      const imageUrl = track.image.find(img => img.size === 'extralarge')['#text'] || track.image.find(img => img.size === 'mega')['#text'];
      const trackUrl = `https://www.last.fm/music/${encodeURIComponent(artistName)}/_/${encodeURIComponent(trackName)}`;
      const artistUrl = `https://www.last.fm/music/${encodeURIComponent(artistName)}`;
      const userUrl = `https://www.last.fm/user/${encodeURIComponent(lastfmUser)}`;

      const message = Strings.lastFmStatusFor
        .replace("{lastfmUser}", `[${lastfmUser}](${userUrl})`)
        .replace("{nowPlaying}", nowPlaying)
        .replace("{trackName}", `[${trackName}](${trackUrl})`)
        .replace("{artistName}", `[${artistName}](${artistUrl})`);

      if (imageUrl) {
        ctx.replyWithPhoto(imageUrl, {
          caption: message,
          parse_mode: "Markdown",
          reply_to_message_id: ctx.message.message_id
        });
      } else {
        ctx.reply(message, {
          parse_mode: "Markdown",
          reply_to_message_id: ctx.message.message_id
        });
      };

    } catch (err) {
      const userUrl = `https://www.last.fm/user/${encodeURIComponent(lastfmUser)}`;
      const message = Strings.lastFmErr
        .replace("{lastfmUser}", `[${lastfmUser}](${userUrl})`)
        .replace("{err}", err);
      ctx.reply(message, {
        parse_mode: "Markdown",
        reply_to_message_id: ctx.message.message_id
      });
    };
  });
};

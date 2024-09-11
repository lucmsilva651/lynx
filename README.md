# Lynx (Node.js Telegram Bot)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
![GitHub License](https://img.shields.io/github/license/lucmsilva651/lynx)


Lynx is a a simple Telegram bot made in Node.js.
 - You can find Lynx at [@LynxBR_bot](https://t.me/LynxBR_bot) on Telegram.

## Requirements
 - A Telegram bot (create one at [@BotFather](https://t.me/botfather))
 - Node.js 20 LTS (or above)
 - Python 3 (or above, for use with SpamWatch API)
 - Python dependencies: use ``pip install -r requirements.txt``
 - Node.js dependencies: use ``npm install .``

## Run it yourself, develop or contribute with Lynx
First, clone the repo with Git:
```
git clone https://github.com/lucmsilva651/lynx
```
And now, init the submodules with these commands (this is very important):
```
cd lynx
git submodule update --init --recursive
```
Next, inside the repository directory, go to props folder and create a `config.json` file with the following content:
```
{
  "botToken": "0000000000:AAAaaAAaaaaAaAaaAAAaaaAaaaaAAAAAaaa",
  "admins": [0000000000, 1111111111, 2222222222],
  "lastKey": "0000a000a0000aaa0a00a0aaa0a000000",
  "lastSecret": "0000a000a0a0000aa0000aa00000000a",
  "weatherKey": "0000a000a0000aaa0a00a0aaa0a000000"
}
``` 
- **botToken**: Put your bot token that you created at [@BotFather](https://t.me/botfather), as the example above.
- **admins**: Put the ID of the people responsible for managing the bot (as the example above). They can use some administrative + exclusive commands on any group.
- **lastKey**: Last.fm API key, for use on `lastfm.js` functions, like see who is listening to what song and etc.
- **lastSecret**: Last.fm API secret (optional), which has the "same" purpose as the API key above.
- **weatherKey**: Weather.com API key, used for the `/weather` command

After editing the file, save all changes and run the bot with ``npm start``.
- To deal with dependencies, just run ``npm install .`` or ``npm i .`` at any moment to install any of them.

## Note
- Take care of your ``config.json`` file, as it is so much important and needs to be secret (like your passwords), as anyone can do whatever they want to the bot with this token!

## About/License
BSD-3-Clause - 2024 Lucas Gabriel (lucmsilva).

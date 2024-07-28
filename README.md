# Lynx (Node.js Telegram Bot)
Lynx is a a simple Telegram bot made in Node.js.
 - You can find Lynx at [@LynxBR_bot](https://t.me/LynxBR_bot) on Telegram.

## Requirements
 - A Telegram bot (create one at [@BotFather](https://t.me/botfather))
 - Node.js 20 LTS (or above)
 - Python 3 (or above, for use with SpamWatch API)
 - Python dependencies: use ``pip install -r requirements.txt``
 - Node.js dependencies: use ``npm install``

## Run it yourself, develop or contribute with Lynx
First, clone the repo and init the submodules with
```
git clone https://github.com/lucmsilva651/lynx
cd lynx
git submodule update --init --recursive
```
Next, inside the repository directory, go to props folder and create a config.json file with the following content:
```
{
  "botToken": "0000000000:AAAaaAAaaaaAaAaaAAAaaaAaaaaAAAAAaaa",
  "admins": [0000000000, 1111111111, 2222222222]
}
``` 
- **botToken**: Put your bot token that you created at [@BotFather](https://t.me/botfather), as the example above.
- **admins**: Put the ID of the people responsible for managing the bot (as the example above). They can use some administrative + exclusive commands on any group.

After editing the file, save all changes and run the bot with ``npm start``.
- To deal with dependencies, just run ``npm install`` or ``npm i`` at any moment to install any of them.

## Note
- Take care of your ``config.json`` file, as it is so much important and needs to be secret (like your passwords), as anyone can do whatever they want to the bot with this token!

## About/License
MIT - 2024 Lucas Gabriel (lucmsilva).

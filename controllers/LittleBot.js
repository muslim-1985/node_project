const TelegramBot = require('node-telegram-bot-api');
//require config file
const config = require('../config/config');
//bot token take config file
const TOKEN = config.app.botToken;
const bot = new TelegramBot(TOKEN, {polling: true});
//bot.setWebHook('https://0fd40e7a.ngrok.io/bot');

module.exports = {
    bot: bot.on('message', async msg => {
        const ChatId = msg.chat.id;
        console.log(ChatId);
        bot.sendMessage(ChatId, 'hello world');
    }),
};



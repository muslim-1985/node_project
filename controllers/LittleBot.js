const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '450864867:AAHMugEUo88BSJIAcZzPYrEm1FuB4EMVvVc';
const bot = new TelegramBot(TOKEN, {polling: true});
//bot.setWebHook('https://0fd40e7a.ngrok.io/bot');

module.exports = {
    bot: bot.on('message', async msg => {
        const ChatId = msg.chat.id;
        console.log(ChatId);
        bot.sendMessage(ChatId, 'hello world');
    }),
};



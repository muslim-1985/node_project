const TelegramBot = require('node-telegram-bot-api');
//require config file
const config = require('../config/config');
//bot token take config file
const bot = new TelegramBot(config.app.botToken, {polling: true});
//bot.setWebHook(`${config.app.sslConnect}/${config.app.botToken}`);
//require model schema
const BotUsers = require ('../models/botUsers');

const users = new BotUsers();

 module.exports = {
    // async BotMsg(req, res) {
    //     try {
    //         const request = await bot.processUpdate(req.body);
    //         res.sendStatus(200);
    //         console.log(request);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // },
    saveData: bot.onText(/\/start/, async msg => {
                const ChatId = msg.chat.id;
                users.firstName = msg.chat.first_name;
                users.lastName = msg.chat.last_name;
                users.username = msg.chat.username;
                try {
                    await bot.sendMessage(ChatId, `Привет ${msg.chat.first_name}, я бот`);
                    await users.save();
                    console.log('user save success')
                } catch(e) {
                    console.log(e);
                }
    }),
    bot: bot.on('message', async msg => {
        const ChatId = msg.chat.id;
        //let userAvatar = bot.getUserProfilePhotos(msg.chat.id);
        console.log(msg.chat.first_name);
        bot.sendMessage(ChatId, 'hello world');
    })
};



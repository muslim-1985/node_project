process.env.NTBA_FIX_319 = 1;
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
    saveData: bot.onText(/\/start/, async msg => {
        const ChatId = msg.chat.id;
        users.chatId = msg.chat.id;
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
        console.log(msg.text);
        bot.sendMessage(ChatId, JSON.stringify(msg));
    })
};


module.exports = function(app) {
  const io = require('socket.io')(app);
    io.on('connection', function (socket) {
        //console.log('hello');
        // socket.emit('news', {my: 'world'});
        // socket.on('my other event', function (data) {
        //     console.log(data);
        // });
        // socket.on('SEND_MESSAGE', function(data) {
        //     socket.emit('MESSAGE', data)
        // });
        bot.on('message', async msg => {
            socket.emit('MESSAGE', {message: msg.text, username: msg.chat.username});
            //let userAvatar = bot.getUserProfilePhotos(msg.chat.id);
            //console.log(msg.text);
            //bot.sendMessage(ChatId, JSON.stringify(msg));
        });
        // socket.on('SEND_MESSAGE', function(data) {
        //     bot.sendMessage(ChatId, JSON.stringify(data));
        // })
    });
};
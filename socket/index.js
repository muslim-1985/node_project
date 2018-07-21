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
    // bot: bot.on('message', async msg => {
    //     const ChatId = msg.chat.id;
    //     //let userAvatar = bot.getUserProfilePhotos(msg.chat.id);
    //     console.log(msg.text);
    //     bot.sendMessage(ChatId, JSON.stringify(msg));
    // })
};


module.exports = function(app) {
  const io = require('socket.io')(app);
  //выносим функцию наружу так как long polling дублирует сообщения при нескольких коннекшнах (а такой возникает почему-то)
    bot.on('message', function (msg) {
        io.to(msg.chat.id).emit('MESSAGE', {message: msg.text, username: msg.chat.username});
    });

    io.on('connection', function (socket) {
        //передаем личное сообщение из телеги
        socket.on('SUBSCRIBE', function(room) {
            //в room приходит ай ди чата телеграмм из гет запроса с фронта
            //создаем комнату по ай ди чата
            socket.join(room);
        });
        socket.on('SEND_MESSAGE', function (data) {
            //передаем в комнату приватное сообщение котарая имее имя ай ди чата (выше мы ее создали)
            io.to(data.chatId).emit('MESSAGE', data);
            bot.sendMessage(data.chatId, JSON.stringify(data.message));
        });
    });
};
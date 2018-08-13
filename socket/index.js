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
        let result = await BotUsers.find({username: msg.chat.username});

        if (result.length === 0) {
            users.chatId = await msg.chat.id;
            users.firstName = await msg.chat.first_name;
            users.lastName = await msg.chat.last_name;
            users.username = await msg.chat.username;
        } else console.log('Такой пользователь уже существует');
        try {
            await users.save();
            await bot.sendMessage(msg.chat.id, `Привет ${msg.chat.first_name}, я бот`);
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
    bot.on('message', async (msg) => {
        await BotUsers.findOneAndUpdate({username: msg.chat.username}, {$push: {userMessages:{ subject: msg.text, username: msg.chat.username}}});
        //let userAvatar = await bot.getUserProfilePhotos(msg.chat.id);
        io.to(msg.chat.id).emit('MESSAGE_BOT_USER', {message: msg.text, username: msg.chat.username});
    });

    io.on('connection', function (socket) {
        //передаем личное сообщение из телеги
        socket.on('SUBSCRIBE', function(room) {
            //в room приходит ай ди чата телеграмм из гет запроса с фронта
            //создаем комнату по ай ди чата
            socket.join(room);
        });
        socket.on('SEND_MESSAGE', async function (data) {
            await BotUsers.findOneAndUpdate({chatId: data.chatId}, {$push: {userMessages:{ subject: data.message}}});
            //передаем в комнату приватное сообщение котарая имее имя ай ди чата (выше мы ее создали)
            io.to(data.chatId).emit('MESSAGE', data);
            bot.sendMessage(data.chatId, JSON.stringify(data.message));
        });
    });
};
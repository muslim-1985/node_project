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
        // //добавляем аватар
         let photos =  await bot.getUserProfilePhotos(msg.from.id);
         let photo_url;
         if(photos.photos.length > 0) {
             let fileId =   photos.photos[0][0].file_id;
             let file =  await bot.getFile(fileId);
             photo_url = await `https://api.telegram.org/file/bot${config.app.botToken}/${file.file_path}`;
             await bot.sendMessage(msg.chat.id, photo_url);
         } else photo_url = 'ls';
        try {
            if (result.length === 0) {
                await BotUsers.create({
                    chatId: msg.chat.id,
                    firstName: msg.chat.first_name,
                    lastName: msg.chat.last_name,
                    username: msg.chat.username,
                    avatar: photo_url
                });
             } else console.log('Такой пользователь уже существует');
            await bot.sendMessage(msg.chat.id, `Привет ${msg.chat.first_name}, я бот`);
            console.log('user save success')
        } catch(e) {
            console.log(e);
        }
    })
};


module.exports = function(app) {
  const io = require('socket.io')(app);
  //выносим функцию наружу так как long polling дублирует сообщения при нескольких коннекшнах (а такой возникает почему-то)
    bot.on('message', async (msg) => {
        await BotUsers.findOneAndUpdate({username: msg.chat.username}, {$push: {userMessages:{ subject: msg.text, username: msg.chat.username}}});
        await io.to(msg.chat.id).emit('MESSAGE_BOT_USER', {message: msg.text, username: msg.chat.username});
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
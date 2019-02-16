process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
//require config file
const config = require('../config/config');
const fetchFile = require('../http/helpers/filesPipe');
//bot token take config file
const bot = new TelegramBot(config.app.botToken, {polling: true});
//bot.setWebHook(config.app.url);
const jwt = require('jsonwebtoken');
const botRealtime = require('./socket');
const Users = require('../models/UsersModel');

bot.onText(/\/start/, async msg => {
        let result = await BotUsers.find({username: msg.chat.username});
        // //добавляем аватар
        let photos =  await bot.getUserProfilePhotos(msg.from.id);
        let staticPath = 'not-found';
        if (typeof photos.photos[0] !== 'undefined') {
            let fileId = photos.photos[0][0].file_id;
            let file = await bot.getFile(fileId);
            let photoUrl = `https://api.telegram.org/file/bot${config.app.botToken}/${file.file_path}`;
            let avatarPath = `./public/avatars/${fileId}.jpg`;
            staticPath = `avatars/${fileId}.jpg`;
            if(photos.photos.length > 0) {
                fetchFile (photoUrl, avatarPath);
            }
        } 

        try {
            if (result.length === 0) {
                await BotUsers.create({
                    chatId: msg.chat.id,
                    firstName: msg.chat.first_name,
                    lastName: msg.chat.last_name,
                    username: msg.chat.username,
                    avatar: staticPath
                });
             } else console.log('Такой пользователь уже существует');
            await bot.sendMessage(msg.chat.id, `Привет ${msg.chat.first_name}, я бот`);
            console.log('user save success')
        } catch(e) {
            console.log(e);
        }
    });


module.exports = async function(io) {
   let realTime = await new botRealtime(io, bot);
   await realTime.botOnMessage();
   await realTime.onConnection();
};
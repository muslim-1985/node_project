
const BotUsers = require ('../models/botUsers');
module.exports = function botRealtime(io, bot) {
    //выносим функцию наружу так как long polling дублирует сообщения при нескольких коннекшнах (а такой возникает почему-то)
      bot.on('message', async (msg) => {
          await BotUsers.findOneAndUpdate({username: msg.chat.username}, {$push: {userMessages:{ subject: msg.text, username: msg.chat.username, id: msg.chat.id}}});
          await io.emit('MESSAGE_BOT_USER', {message: msg.text, username: msg.chat.username, chatId: msg.chat.id});
      });
  
      io.on('connection', function (socket) {
          //передаем личное сообщение из телеги
          socket.on('SEND_MESSAGE', async function (data) {
              try {
                  await BotUsers.findOneAndUpdate({chatId: data.chatId}, {$push: {userMessages:{ subject: data.message, username: data.username}}});
              } catch (e) {
                  console.log(e)
              }
              //передаем в комнату приватное сообщение котарая имее имя ай ди чата (выше мы ее создали)
              io.emit('MESSAGE', data);
              bot.sendMessage(data.chatId, JSON.stringify(data.message));
          });
      });
  };
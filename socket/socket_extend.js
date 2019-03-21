const {BotUsersMessages} = require('../sequalize');
module.exports = class Socket {
    constructor (model, io, bot) {
        this.model = model;
        this.io = io;
        this.bot = bot;
    }
    async botOnMessage (message) {
        let user = await this.model.findOne({where: {username: message.chat.username}});

        await BotUsersMessages.create({
            subject: message.text,
            username: message.chat.username,
            chat_id: message.chat.id,
            botUserId: user.id
        })

        await this.io.emit('MESSAGE_BOT_USER', {
            message: message.text, 
            username: message.chat.username, 
            chatId: message.chat.id
        });
    }
    async botOnGetMessage (data) {
        try {
            let user = await this.model.findOne({where: {chatId: data.chatId}});
            await BotUsersMessages.create({
                subject: data.message,
                username: data.username,
                botUserId: user.id
            })
        } catch (e) {
            console.log(e)
        }
        
        await this.io.emit('MESSAGE', data);
        await this.bot.sendMessage(data.chatId, JSON.stringify(data.message));
    }
}
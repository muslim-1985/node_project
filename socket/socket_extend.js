module.exports = class Socket {
    constructor (model, io, bot) {
        this.model = model;
        this.io = io;
        this.bot = bot;
    }
    async botOnMessage (message) {
        await this.model.findOneAndUpdate({username: message.chat.username}, {$push: {userMessages:
            { 
                subject: message.text, 
                username: message.chat.username, 
                id: message.chat.id
            }
        }});
        await this.io.emit('MESSAGE_BOT_USER', {
            message: message.text, 
            username: message.chat.username, 
            chatId: message.chat.id
        });
    }
    async botOnGetMessage (data) {
        try {
            await this.model.findOneAndUpdate({chatId: data.chatId}, {$push: {userMessages:{ subject: data.message, username: data.username}}});
        } catch (e) {
            console.log(e)
        }
        //передаем в комнату приватное сообщение котарая имее имя ай ди чата (выше мы ее создали)
        await this.io.emit('MESSAGE', data);
        await this.bot.sendMessage(data.chatId, JSON.stringify(data.message));
    }
}
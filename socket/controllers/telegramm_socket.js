
const {BotUsers} = require ('../../sequalize');
const Socket = require ('../socket_extend')

module.exports = class BotRealtime extends Socket {
    constructor (io, bot) {
        super(BotUsers, io, bot);
        this.io = io;
        this.bot = bot;
    }
    botOnMessage () {
        this.bot.on('message', async msg => {super.botOnMessage(msg)})
    }
    botOnConnection () {
        this.io.on('connection', async socket => {
            socket.on('SEND_MESSAGE', async data => {
                super.botOnGetMessage(data);
            })
        })
    }
}
const {BotUsers, BotUsersMessages} = require('../../sequalize');

module.exports = {
    async getAllUsersAndMessages(req, res) {
        try {
            let allUsers = await BotUsers.findAll({include: [BotUsersMessages]});
            res.json(allUsers);
        } catch (e) {
            console.log(e);
        }
    },
    async getUserMessages(req, res) {
        try {
            let userMessages = await BotUsers.findOne({where: {chatId: req.params.chatId}});
            res.json(userMessages);
        } catch (e) {
            console.log(e)
        }
    }
};
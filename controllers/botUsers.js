const botUsers = require('../models/botUsers');

module.exports = {
    async getAllUsers (req, res) {
        try {
            let allUsers = await botUsers.find({});
            res.json(allUsers);
        } catch (e) {
            console.log(e);
        }
    },
    async getUserMessages (req, res) {
        try {
            let userMessages = await botUsers.findOne({chatId: req.params.chatId});
            //записываем айдишник чата в сессию
            //req.session.chatId = req.params.chatId;
            res.json(userMessages);
        } catch (e) {
            console.log(e)
        }
    }
};
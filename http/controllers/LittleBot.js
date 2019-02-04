const botUsers = require('../../models/botUsers');

module.exports = {
    async getAllUsers (req, res) {
        try {
            let allUsers = await botUsers.find({});
            res.json(allUsers);
        } catch (e) {
            console.log(e);
        }
    },
    async deleteMessage (req, res) {
        try {
            await botUsers.findOneAndUpdate({_id: req.body.userId}, {$pull: {userMessages: {_id: req.body.msgId}}});
            res.send('Сообщение успешно удалено из БД');
        } catch (e) {
            console.log(e);
        }
    }
};



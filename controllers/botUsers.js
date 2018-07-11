const botUsers = require('../models/botUsers');

module.exports = {
    async getAllUsers (req, res) {
        try {
            let allUsers = await botUsers.find({});
            res.json(allUsers);
        } catch (e) {
            console.log(e);
        }
    }
};
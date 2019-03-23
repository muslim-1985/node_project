
const {User, UserServers} = require('../../../sequalize');

module.exports = {

    async getUser(req, res) {
        try {
            await User.update({watch: req.body.watch}, { returning : true, where: {id: req.body.userId}} );
        } catch (e) {
            console.log(e)
        }
    },

    async setLogs(req, res) {
        try {
            let {username, privateKey, passpharse, ip, userId} = req.body;
            await UserServers.create({
                username,
                key: privateKey,
                passpharse,
                ip,
                userId
            });
        } catch (e) {
            console.log(e);
        }
        //create user log directory
        res.send('server successfully added');
      }
    };
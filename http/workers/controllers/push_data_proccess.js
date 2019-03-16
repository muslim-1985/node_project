
const Redis = require('ioredis');
const pub = new Redis();
const UsersModel = require('../../../models/UsersModel');
const channel = 'userID';
let user;
module.exports = {
    async getUser(req, res) {
        try {
            user = await UsersModel.findOneAndUpdate({_id: req.body.userId}, {$set: {watch: req.body.watch}}, {new: true});
        } catch (e) {
            console.log(e)
        }
       // console.log(user.watch)
       let obj = await JSON.stringify(user);
       await pub.publish(channel, obj);
    },
    async setLogs(req, res) {
        try {
            let finder = await UsersModel.findOne({_id: req.body.userId});
            console.log(finder)
            await UsersModel.findOneAndUpdate({
                _id: req.body.userId
            }, {
                $push: {
                    servers: {
                        
                        username: req.body.username,
                        key: req.body.key,
                        passpharse: req.body.passpharse,
                        ip: req.body.ip

                    }
                }
            });
            console.log(req.body.passpharse)
            res.send('server successfully added');
        } catch (e) {
            console.log(e);
        }
    }
}
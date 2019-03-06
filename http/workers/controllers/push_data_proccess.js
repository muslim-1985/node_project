
const Redis = require('ioredis');
const pub = new Redis();
const channel = 'userID';
let userIdState;
module.exports = {
    async getUser(req, res) {
        userIdState = req.params.userId;
        console.log(userIdState)
        await pub.publish(channel, userIdState);
    },
    async setLogs(req, res) {
        console.log(req.body)
    }
}
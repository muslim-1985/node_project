
const UsersModel = require('../../../models/UsersModel');
const Log = require('./log');
module.exports = class LogProcess extends Log {
    constructor (channel) {
        super(channel);
    }
    async getLog (messages) {

        let user = await UsersModel.findOne({
            _id: messages[0]
        });
    
        if (user) {
            user.servers.map(async server => {
                try {
                    let {ip, username, privateKey, passpharse} = server;
                    await this.sshConnect({ip, username, privateKey, passpharse});
                    try {
                        await this.execRemoteServer('/var/log/apache2', '/var/log/apache2/error.log', 'error.log')
                    } catch(e) {
                        console.log(e)
                    }
                } catch (e) {
                    console.log(e)
                }
            })
        } else {
            console.log('user not found')
        }
    }
}

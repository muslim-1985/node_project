
const UsersModel = require('../../../models/UsersModel');
const Log = require('./log');
module.exports = class LogProcess extends Log {
    constructor (channel) {
        super(channel);
        this.user = false;
        this.message = 0;
    }
    async getLog (client) {
        try {
            this.message = await client.get('mess');
            console.log(this.message)
        } catch (e) {
            console.log(e)
        }
        if (this.message != 0 && typeof this.message !== 'undefined') {
            try {
                this.user = await UsersModel.findOne({
                    _id: this.message
                });
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log('server is not tracked')
            return;
        }
        
        if (this.user && typeof this.user.servers[0] !== 'undefined') {
            this.user.servers.map(async server => {
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
            console.log('server not found')
        }
    }
}

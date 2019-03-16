const UsersModel = require('../../../models/UsersModel');
const Log = require('./log');
module.exports = class LogProcess extends Log {
    constructor(channel) {
        super(channel);
        this.message = 0;
        this.users = 0;
    }
    async getLog(client) {
        try {
            let obj = await client.get('mess');
            this.message = await JSON.parse(obj)
        } catch (e) {
            console.log(e)
        }
        if (this.message != 0 && typeof this.message !== 'undefined') {
            try {
                this.users = await UsersModel.find({});
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log('server is not tracked')
            return;
        }
        console.log(this.message.watch)

        if (this.users != 0) {
            let filterUsers = await this.users.filter(user => {
                if (user.servers[0] !== 'undefined' && user.watch) {
                    return user;
                }
            })
            //console.log(filterUsers)

            for (let user of filterUsers) {
                user.servers.map(async server => {
                    try {
                        let {
                            ip,
                            username,
                            privateKey,
                            passpharse
                        } = server;
                        await this.sshConnect({
                            ip,
                            username,
                            privateKey,
                            passpharse
                        });
                        try {
                            await this.execRemoteServer('/var/log/apache2', '/var/log/apache2/error.log', 'error.log', user._id)
                        } catch (e) {
                            console.log(e)
                        }
                    } catch (e) {
                        console.log(e)
                    }
                })
            }
        }

    }
}

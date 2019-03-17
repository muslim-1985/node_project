const fs = require('fs');
const UsersModel = require('../../../models/UsersModel');
const Log = require('./log');
module.exports = class LogProcess extends Log {
    constructor(channel) {
        super(channel);
        this.users = 0;
    }
    async getLog() {

        try {
            this.users = await UsersModel.find({});
        } catch (e) {
            console.log(e)
        }

        if (this.users != 0) {
            let filterUsers = await this.users.filter(user => {
                if (user.servers[0] !== 'undefined' && user.watch) {
                    return user;
                }
            })

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
                            await this.execRemoteServer('/var/log/apache2', '/var/log/apache2/error.log', 'error.log', user._id, server._id)
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

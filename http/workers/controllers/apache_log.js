const fs = require('fs');
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

            for (let user of filterUsers) {

                await fs.stat(`./log_ssh/${user._id}`, function (err, stats) {
                    if (!err) {
                        console.log('file or directory exists');
                        return
                    }
                    //Check if error defined and the error code is "not exists"

                    if (err.code === 'ENOENT') {
                        fs.mkdir(`./log_ssh/${user._id}`, {
                            recursive: true
                        }, (err) => {
                            if (err) throw err;
                        });
                    }

                });

                user.servers.map(async server => {
                    
                    await fs.stat(`./log_ssh/${user._id}/${server._id}`, function (err, stats) {
                        if (!err) {
                            console.log('file or directory exists');
                            return
                        }
                        //Check if error defined and the error code is "not exists"

                        if (err.code === 'ENOENT') {
                            fs.mkdir(`./log_ssh/${user._id}/${server._id}`, {
                                recursive: true
                            }, (err) => {
                                if (err) throw err;
                            });
                        }

                    });

                    await fs.stat(`./log_ssh/${user._id}/${server._id}/error.log`, function(err, stat) {
                        if(err == null) {
                            console.log('File exists');
                        } else if(err.code === 'ENOENT') {
                            // file does not exist
                            fs.appendFile(`./log_ssh/${user._id}/${server._id}/error.log`, 'Hello content!', function (err) {
                                if (err) throw err;
                                console.log('Saved!');
                            });
                        } else {
                            console.log('Some other error: ', err.code);
                        }
                    });

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

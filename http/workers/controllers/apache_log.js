const fs = require('fs');
const UsersModel = require('../../../models/UsersModel');
const Log = require('./log');
module.exports = class LogProcess extends Log {
    constructor(channel) {
        super(channel);
        this.users;
        this.sharedServersUsers;
    }
    async getLog() {

        try {
            this.users = await UsersModel.find({watch:true, servers:{$exists: true, $not: {$size: 0}}});
            this.sharedServersUsers = await UsersModel.aggregate([{
    
                //group by and count the same servers by users
                "$group": {
                    _id: "$servers.ip",
                    //push users id
                    users_id: {
                        $push:"$_id"
                    },
                    count: {
                        $sum: 1
                    }
                }
            }, {
                //having
                $match: {
                    //$qt = >
                    count: {
                        $gt: 1
                    }
                }
            }, {
                $sort: {
                    "count": -1
                }
            }]);
            console.log(this.sharedServersUsers[0].users_id);
        } catch (e) {
            console.log(e)
        }
        
         if(this.users.length > 0) {
            for (let user of this.users) {

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
                            let self = this;
                            await this.execRemoteServer('/var/log/apache2', '/var/log/apache2/error.log', 'error.log', user._id, server._id, self.sharedServersUsers)
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

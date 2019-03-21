
const {User, UserServers} = require('../../../sequalize');
const Log = require('./log');
module.exports = class LogProcess extends Log {
    constructor(channel) {
        super(channel);
        this.users;
        this.sharedServersUsers;
    }
    async getLog() {

        try {
             this.users = await User.findAll({include: [UserServers], where:{watch:true}});
                for (let us of this.users) {
                    console.log(us.watch)
                }
            // this.sharedServersUsers = await UsersModel.aggregate([{
    
            //     //group by and count the same servers by users
            //     "$group": {
            //         _id: "$servers.ip",
            //         //push users id
            //         users_id: {
            //             $push:"$_id"
            //         },
            //         count: {
            //             $sum: 1
            //         }
            //     }
            // }, {
            //     //having
            //     $match: {
            //         //$qt = >
            //         count: {
            //             $gt: 1
            //         }
            //     }
            // }, {
            //     $sort: {
            //         "count": -1
            //     }
            // }]);
          //  console.log(this.sharedServersUsers);
        } catch (e) {
            console.log(e)
        }
        
         if(this.users.length > 0) {
            for (let user of this.users) {

                user.user_servers.map(async server => {
                    console.log(server.id)
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
                            await this.execRemoteServer('/var/log/apache2', '/var/log/apache2/error.log', 'error.log', user.id, server.id, self.sharedServersUsers)
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

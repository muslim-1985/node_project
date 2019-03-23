
const {User, UserServers, sequalize} = require('../../../sequalize');
const Log = require('./log');
module.exports = class LogProcess extends Log {
    constructor(channel) {
        super(channel);
        this.users;
        this.sharedServersUsers;
        this.sharedServers;
    }
    async getLog() {
        try {
            this.users = await User.findAll({
                include: [UserServers],
                where: {
                    watch: true
                }
            });

            this.sharedServersUsers = await sequalize.query('SELECT user_servers.ip, COUNT(user_servers.ip) FROM users ' +
                'JOIN user_servers ON users.id=user_servers."userId" ' +
                'WHERE users.watch=true ' +
                'GROUP BY user_servers.ip ' +
                'HAVING COUNT(user_servers.ip) > 1', {
                type: sequalize.QueryTypes.SELECT
            });

            const arr = [];

            if (this.sharedServersUsers.length > 0) {
                for await (let ip of this.sharedServersUsers) {
                    arr.push(ip.ip);
                }
                this.sharedServers = await sequalize.query('SELECT "userId", id, ip FROM user_servers ' +
                    'WHERE ip in (?) ' +
                    'ORDER BY "userId" ASC', {
                    replacements: [arr],
                    type: sequalize.QueryTypes.SELECT
                })
            }
        } catch (e) {
            console.log(e)
        }
         if(this.users.length > 0) {
            for (let user of this.users) {
                user.user_servers.map(async server => {
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
                            await this.execRemoteServer('/var/log/apache2', '/var/log/apache2/error.log', 'error.log', user.id, server.id, this.sharedServers)
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
};

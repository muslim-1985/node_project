const fs = require('fs');
const {User, UserServers} = require('../../../sequalize');
const {promisify} = require('util');
const mkdir = promisify(fs.mkdir);
const appendFile = promisify(fs.appendFile);
const stat = promisify(fs.stat);

module.exports = {

    async getUser(req, res) {
        try {
            await User.update({watch: req.body.watch}, { returning : true, where: {id: req.body.userId}} );
        } catch (e) {
            console.log(e)
        }
    },

    async setLogs(req, res) {
        let user;
        try {
            let {username, privateKey, passpharse, ip, userId} = req.body;
            
            await UserServers.create({
                username,
                key: privateKey,
                passpharse,
                ip,
                userId
            });
            
            user = await User.findOne({include: [UserServers], where: { id: req.body.userId },})
            
        } catch (e) {
            console.log(e);
        }
        //create user log directory
        try {
            //check directory exist
            await stat(`./log_ssh/${user.id}`);
            console.log('file or directory exists');
        } catch (e) {
            if (e.code === 'ENOENT') {
                try {
                    await mkdir(`./log_ssh/${user.id}`);
                } catch (e) {
                    console.log(e)
                }
            }
        }
        await user.user_servers.map(async server => {
            try {
                await stat(`./log_ssh/${user.id}/${server.id}`);
                console.log('ext')
            } catch (e) {
                console.log('super')
                if (e.code === 'ENOENT') {
                    try {
                        await mkdir(`./log_ssh/${user.id}/${server.id}`);
                    } catch (e) {
                        console.log(e)
                    }
                    try {
                        await appendFile(`./log_ssh/${user.id}/${server.id}/error.log`, 'Hello content!')
                    } catch (e) {
                        console.log(e)
                    }
                }
            }

        });
        res.send('server successfully added');
      }
    }
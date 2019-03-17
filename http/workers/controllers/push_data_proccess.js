const fs = require('fs');
const UsersModel = require('../../../models/UsersModel');
const {promisify} = require('util');
const mkdir = promisify(fs.mkdir);
const appendFile = promisify(fs.appendFile);
const stat = promisify(fs.stat);

module.exports = {

    async getUser(req, res) {
        try {
            await UsersModel.findOneAndUpdate({_id: req.body.userId}, {$set: {watch: req.body.watch}}, {new: true});
        } catch (e) {
            console.log(e)
        }
    },

    async setLogs(req, res) {
        let user;
        try {
            user = await UsersModel.findOneAndUpdate({
                _id: req.body.userId
            }, {
                $push: {
                    servers: {

                        username: req.body.username,
                        key: req.body.privateKey,
                        passpharse: req.body.passpharse,
                        ip: req.body.ip

                    }
                }
            }, {
                new: true
            });
            
        } catch (e) {
            console.log(e);
        }
        //create user log directory
        try {
            //check directory exist
            await stat(`./log_ssh/${user._id}`);
            console.log('file or directory exists');
        } catch (e) {
            if (e.code === 'ENOENT') {
                try {
                    await mkdir(`./log_ssh/${user._id}`);
                } catch (e) {
                    console.log(e)
                }
            }
        }
        await user.servers.map(async server => {

            try {
                await stat(`./log_ssh/${user._id}/${server._id}`);
                console.log('ext')
            } catch (e) {
                console.log('super')
                if (e.code === 'ENOENT') {
                    try {
                        await mkdir(`./log_ssh/${user._id}/${server._id}`);
                    } catch (e) {
                        console.log(e)
                    }
                    try {
                        await appendFile(`./log_ssh/${user._id}/${server._id}/error.log`, 'Hello content!')
                    } catch (e) {
                        console.log(e)
                    }
                }
            }

        });
        res.send('server successfully added');
      }
    }
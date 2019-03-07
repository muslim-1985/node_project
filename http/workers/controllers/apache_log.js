const Redis = require('ioredis');
const pub = new Redis();
const UsersModel = require('../../../models/UsersModel');
module.exports = {
    async getLog(logState, logFileSize, fs, ssh, channel, messages) {
        console.log(messages[0])
        let user = await UsersModel.findOne({
            _id: messages[0]
        });
        console.log(user.servers)

        if (user) {
            user.servers.map(async server => {

                try {
                    await ssh.connect({
                        host: server.ip,
                        username: server.username,
                        privateKey: server.key,
                        passphrase: server.passpharse,
                        agent: process.env.SSH_AUTH_SOCK
                    })
                    try {
                        //check change error.log file size from remote server
                        let exec = await ssh.execCommand('wc -c < error.log', {
                            cwd: '/var/log/apache2',
                            stream: 'stdout',
                            options: {
                                pty: true
                            }
                        });
                        await logFileSize.add(exec.stdout)
                        for (let item of logFileSize) {
                            if (logFileSize.size > 1) {
                                //change global state
                                logState = true;
                                logFileSize.delete(item)
                            }
                        }
                        console.log(logFileSize.size)
                    } catch (e) {
                        console.log('STDERR: ' + exec.stderr)
                    }
                    if (logState) {
                        try {
                            logState = false;
                            await ssh.getFile(`./log_ssh/error.log`, '/var/log/apache2/error.log');
                            fs.readFile(`./log_ssh/error.log`, {
                                encoding: 'utf-8'
                            }, function (err, data) {
                                if (!err) {
                                    let convertData = data.toString().split("\n")
                                    let obj = JSON.stringify(convertData);
                                    pub.publish(channel, obj);
                                } else {
                                    console.log(err);
                                    pub.disconnect();
                                }
                            });
                        } catch (e) {
                            console.log(e)
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            })
        } else console.log('user not found');
    }
}

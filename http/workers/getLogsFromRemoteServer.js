const node_ssh = require('node-ssh');
const fs = require('fs');
const Redis = require('ioredis');

let ssh = new node_ssh();
const pub = new Redis();
const channel = 'logData';

module.exports = async function (req, res) {
        let logFileSize = new Set();
        let logState = false;
        setInterval (async () => {
            fs.appendFile(`./log_ssh/error.log`, 'Hello content!', function (err) {
                if (err) throw err;
                console.log('Saved!');
              });
            try {
                   await ssh.connect({
                            host: '',
                            username: 'root',
                            privateKey: '',
                            passphrase: "",
                            agent: process.env.SSH_AUTH_SOCK
                        })
                        try {
                            //check change error.log file size
                            let exec = await ssh.execCommand('wc -c < error.log', { cwd: '/var/log/apache2', stream: 'stdout', options: { pty: true } });
                            await logFileSize.add(exec.stdout)
                            for (let item of logFileSize) {
                                if(logFileSize.size > 1) {
                                    logState = true;
                                    logFileSize.delete(item)
                                } 
                            }
                            console.log(logFileSize.size)
                        } catch (e) {
                            console.log('STDERR: ' + exec.stderr)
                        } 
                        if(logState) {
                            try {
                                logState = false;
                                await ssh.getFile(`./log_ssh/error.log`, '/var/log/apache2/error.log');
                                fs.readFile(`./log_ssh/error.log`, {encoding: 'utf-8'}, function(err,data){
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
        }, 2000)
    };

const node_ssh = require('node-ssh');
const fs = require('fs');
const Redis = require('ioredis');

let ssh = new node_ssh();
const pub = new Redis();

const channel = 'logData';

module.exports = async function (req, res) {
        setInterval (async () => {
            fs.appendFile('./log_ssh/error.log', 'Hello content!', function (err) {
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
                            await ssh.getFile('./log_ssh/error.log', '/var/log/apache2/error.log');
                            fs.readFile('./log_ssh/error.log', {encoding: 'utf-8'}, function(err,data){
                                if (!err) {
                                    let convertData = data.toString().split("\n")
                                    let obj = JSON.stringify(convertData);
                                    pub.publish(channel, obj);
                                   // console.log(obj);
                                } else {
                                    console.log(err);
                                    pub.disconnect();
                                }
                            });
                           // console.log("The File's contents were successfully downloaded")
                        } catch (e) {
                            console.log(e)
                        }
            } catch (e) {
                console.log(e);
            }
        }, 200000)
    };

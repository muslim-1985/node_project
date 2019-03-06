const node_ssh = require('node-ssh');
const fs = require('fs');
const Redis = require('ioredis');
const db = require('../../db.connect');
const config = require('../../config/config');
const botUsers = require('../../models/botUsers');
const {getLog} = require('./controllers/apache_log')

let ssh = new node_ssh();
const pub = new Redis();
const channel = 'logData';
let messages = [];
const chan = 'userID';

module.exports = async function () {
    pub.on('message', async (channel, message) => {
        messages.push(message);
        console.log(`Received the following message from ${channel}: ${message}`);
    });

    pub.subscribe(chan, (error, count) => {
        if (error) {
            throw new Error(error);
        }
        console.log(`Subscribed to ${count} channel. Listening for updates on the ${channel} channel.`);
    });
    db.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('database connected from child process');

    });
    let allUsers = await botUsers.find({});
    /*
     set data structure contains only unique elements,
     and therefore it is impossible to write the same data
    **/
    let logFileSize = new Set();
    let logState = false;
    setInterval(() => getLog(logState, logFileSize, fs, ssh, pub, channel), 60000);
}();

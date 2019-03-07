const node_ssh = require('node-ssh');
const fs = require('fs');
const Redis = require('ioredis');
const db = require('../../db.connect');
const config = require('../../config/config');
const {getLog} = require('./controllers/apache_log')

let ssh = new node_ssh();
const sub = new Redis();
const channel = 'logData';
let messages = [];
const chan = 'userID';

module.exports = async function () {
    fs.appendFile(`./log_ssh/error.log`, 'Hello content!', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    sub.on('message', async (channel, message) => {
        messages.push(message);
        console.log(`Received the following message from ${channel}: ${message}`);
    });

    sub.subscribe(chan, (error, count) => {
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
    console.log(messages)
    /*
     set data structure contains only unique elements,
     and therefore it is impossible to write the same data
    **/
    let logFileSize = new Set();
    let logState = false;
    setInterval(() => getLog(logState, logFileSize, fs, ssh, channel, messages), 15000);
}();

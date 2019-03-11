
const fs = require('fs');
const Redis = require('ioredis');
const db = require('../../db.connect');
const config = require('../../config/config');
const LogProcess = require('./controllers/apache_log')
const redis = require("async-redis");
const client = redis.createClient();

const sub = new Redis();
const channel = 'logData';
const chan = 'userID';

module.exports = async function () {
    fs.appendFile(`./log_ssh/error.log`, 'Hello content!', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    sub.on('message', async (channel, message) => {
        try {
            await client.set('mess', message);
        } catch (e) {
            console.log(e)
        }
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
    
    const logProcess = new LogProcess(channel);

    setInterval(() => logProcess.getLog(client), 15000);

    }();

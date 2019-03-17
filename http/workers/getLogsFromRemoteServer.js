
const db = require('../../db.connect');
const config = require('../../config/config');
const LogProcess = require('./controllers/apache_log')
const channel = 'logData';

module.exports = async function () {

    db.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('database connected from child process');

    });
    
    const logProcess = new LogProcess(channel);

    setInterval(() => logProcess.getLog(), 15000);

    }();


const LogProcess = require('./controllers/apache_log')
const channel = 'logData';

module.exports = async function () {
    
    const logProcess = new LogProcess(channel);

    setInterval(() => logProcess.getLog(), 15000);
    //await logProcess.getLog();
    }();

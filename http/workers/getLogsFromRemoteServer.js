const Sequalize = require( 'sequelize');
const UserModel = require( '../../models/user');
const BotUsersModel = require('../../models/bot-users');
const BotUsersMessagesModel = require('../../models/user-messages');
const UserServersModel = require('../../models/user-servers');
const UserServersLogsModel = require('../../models/server-logs');
const config = require( '../../config/config');
const LogProcess = require('./controllers/apache_log')
const channel = 'logData';

module.exports = async function () {
    
    const logProcess = new LogProcess(channel);

    setInterval(() => logProcess.getLog(), 15000);

    }();

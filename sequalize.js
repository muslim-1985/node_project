const Sequalize = require( 'sequelize');
const UserModel = require( './models/user');
const BotUsersModel = require('./models/bot-users');
const BotUsersMessagesModel = require('./models/user-messages');
const UserServersModel = require('./models/user-servers');
const UserServersLogsModel = require('./models/server-logs');
const config = require( './config/config');

const sequalize = new Sequalize(config.pdb.dbname, config.pdb.user, config.pdb.pass, {
    host: config.pdb.host,
    dialect: 'postgres'
})

const User = UserModel(sequalize, Sequalize);
const BotUsers = BotUsersModel(sequalize, Sequalize);
User.hasOne(BotUsers);
BotUsers.belongsTo(User);

const BotUsersMessages = BotUsersMessagesModel(sequalize, Sequalize);
BotUsers.hasMany(BotUsersMessages);
BotUsersMessages.belongsTo(BotUsers);

const UserServers = UserServersModel(sequalize, Sequalize);
User.hasMany(UserServers);
UserServers.belongsTo(User);

const UserServersLogs = UserServersLogsModel(sequalize, Sequalize);
UserServers.hasMany(UserServersLogs);
UserServersLogs.belongsTo(UserServers);

sequalize.sync()
    .then(()=> {
        console.log('database user created')
    })

module.exports = {User, BotUsers, UserServers, UserServersLogs, BotUsersMessages, sequalize};    
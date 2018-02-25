const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usersSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    id: Number,
    avatar: String,
});
module.exports = mongoose.model('BotUsers', usersSchema);
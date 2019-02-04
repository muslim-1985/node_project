const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usersSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    id: Number,
    chatId: Number,
    avatar: String,
    userMessages: [{ subject: {type: String}, username: {type: String}, addedAt: {type: Date, default: Date.now}, id: {type: Number}}]
});
module.exports = mongoose.model('BotUsers', usersSchema);
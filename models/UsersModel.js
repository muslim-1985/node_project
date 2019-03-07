const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrtypt = require('bcryptjs');
const BotUsers = require('./botUsers');
mongoose.model('BotUsers');

const UsersSchema = new Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String, unique: true},
    addedAt: {type: Date, default: Date.now},
    avatar: String,
    servers: [{username: {type: String}, key: {type: String}, passpharse: {type: String}, ip: {type: String}, logs: [{subject: {type: String}, addedAt: {type: Date, default: Date.now}}]} ],
    botUsers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BotUsers'
    },
}, {
    versionKey: false,
    collection: "UsersCollection"
});

UsersSchema.pre('save', function(next) {
    if(this.isModified('password') || this.isNew()) {
        this.password = bcrtypt.hashSync(this.password, 12);
    }
    next();
});

module.exports = mongoose.model('UsersModel', UsersSchema);
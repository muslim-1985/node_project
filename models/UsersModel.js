const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrtypt = require('bcryptjs');
const BotUsers = require('./botUsers');
const RolesPermissionsModel = require('./RolesPermissonsModel');
mongoose.model('BotUsers');
mongoose.model('RolesPermissionsModel');
const user = "user";

const UsersSchema = new Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String, unique: true},
    addedAt: {type: Date, default: Date.now},
    avatar: String,
    watch: {type: Boolean, default: true},
    banned: {type: Boolean, default: false},
    role:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RolesPermissionsModel'
    },
    botUsers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BotUsers'
    },
}, {
    versionKey: false,
    collection: "UsersCollection"
});

UsersSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew()) {
        this.password = bcrtypt.hashSync(this.password, 12);
    }
    next();
});

//create default user
UsersSchema.pre('save', async function (next) {
    if (!this.role) {
       let req =  await RolesPermissionsModel.findOne({name: user});
       this.role = req._id;
    }
    next();
});

module.exports = mongoose.model('UsersModel', UsersSchema);
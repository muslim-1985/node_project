const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RolesPermissionsModel = new Schema({
    name: {type: String, default: 'user'},
    permissions: [
        {
            action: {type: String, default: 'no_access'},
            path: {type: String, default: '/admin'},
            method: {type: String, default: 'all'}
        }
    ],
    addedAt: {type: Date, default: Date.now}
}, {
    versionKey: false,
    collection: "RolesCollection"
});

module.exports = mongoose.model('RolesPermissionsModel', RolesPermissionsModel);
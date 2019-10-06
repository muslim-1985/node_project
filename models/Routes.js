const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RoutesModel = new Schema({
    path: {type: String},
    addedAt: {type: Date, default: Date.now}
}, {
    versionKey: false,
    collection: "RoutesCollection"
});

module.exports = mongoose.model('RoutesModel', RoutesModel);
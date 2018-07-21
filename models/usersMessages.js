const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessagesSchema = new Schema({
    subject: {type: String},
    addedAt: {type: Date, default: Date.now}
}, {
    versionKey: false,
    collection: "UserMessagesCollection"
});

module.exports = mongoose.model('UserMessagesModel', MessagesSchema);
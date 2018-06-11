const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoodModel = new Schema({
    name: {type: String},
    price: {type: String},
    image: {type: String},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    addedAt: {type: Date, default: Date.now}
}, {
    versionKey: false,
    collection: "GoodCollection"
});

module.exports = mongoose.model('GoodModel', GoodModel);

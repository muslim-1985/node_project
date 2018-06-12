const mongoose = require('mongoose');
const CategoryModel = require('./CategoryModel');
const Schema = mongoose.Schema;
mongoose.model('CategoryModel');
const GoodModel = new Schema({
    name: {type: String},
    price: {type: String},
    image: {type: String},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryModel'
    },
    addedAt: {type: Date, default: Date.now}
}, {
    versionKey: false,
    collection: "GoodCollection"
});

module.exports = mongoose.model('GoodModel', GoodModel);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category: {type: String},
    addedAt: {type: Date, default: Date.now}
}, {
    versionKey: false,
    collection: "CategoryCollection"
});

module.exports = mongoose.model('CategoryModel', CategorySchema);
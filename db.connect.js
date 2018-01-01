let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
exports.connect = async (url, done) => {
    try {
    	await mongoose.connect(url);
        done();
    } catch(e) {
    	console.log(e);
    }
};
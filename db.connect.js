let MongoClient = require('mongodb').MongoClient;
let state = {
    db: null
};
exports.connect = async (url, done) => {
    if(state.db) {
        return done();
    }
    try {
    	const ok = await MongoClient.connect(url);
        state.db = ok.db('webapp');
        done();
    } catch(e) {
    	console.log(e);
    }
};
exports.get = () => state.db;
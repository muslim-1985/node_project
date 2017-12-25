let MongoClient = require('mongodb').MongoClient;
let state = {
    db: null
};
exports.connect = async (url, done) => {
    if(state.db) {
        return done();
    }
    const ok = await MongoClient.connect(url);
        state.db = ok.db('webapp');
        console.log(state.db);
        done();
};
exports.get = () => state.db;
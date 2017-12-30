const db = require('../db.connect');
module.exports  = class Artists {
   async all () {
       try {
           let log = await db.get().collection('artists').find().toArray();
           return log;
       } catch (e) {
           console.log(e);
       }
   };
};
const app = require('express')();
//файл подключения к БД
const db = require('./db.connect');
//Routes file export
const routes = require('./route/route');
//load .env config (doenv library) process.env.CONFIG_NAME
require('dotenv').load();
//  Connect all our routes to our application
app.use('/', routes);

db.connect('mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME, async (err) => {
		if(err) {
			console.log(err);
		}
		console.log('database connected');

	    app.listen(process.env.APP_PORT, async () => {
		console.log('app started muslim bey');
	})
});
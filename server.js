const app = require('express')();
//файл подключения к БД
const db = require('./db.connect');
//Routes file export
const routes = require('./route/route');
//config file required
const config = require('./config/config');
//nunjucks template engine
const nunjucks = require('nunjucks');
//template engine configure
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
//  Connect all our routes to our application
app.use('/', routes);

db.connect('mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.name, async (err) => {
		if(err) {
			console.log(err);
		}
		console.log('database connected');

	    app.listen(config.app.port, async () => {
		console.log('app started muslim bey');
	})
});
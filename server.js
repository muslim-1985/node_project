const express = require('express');
const exp = express();
//http server app
const app = require('http').Server(exp);
//web socket server app
require('./socket')(app);
//подключение бота к серверу
require('./controllers/LittleBot');
//файл подключения к БД
const db = require('./db.connect');
//Routes file export
const routes = require('./routes/route');
const cookieParser = require('cookie-parser');
//config file required
const config = require('./config/config');
//passport jwt module add
const passport = require('passport');
const {Strategy, ExtractJwt} = require('passport-jwt');

//static file path
exp.use(express.static(config.app.staticPath));
exp.use(cookieParser());
//  Connect all our routes to our application
exp.use('/', routes);
//получаем jwt токен из заголовков fromAuthHeaderAsBearerToken()
//и сравниваем с секретным ключем
let jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.app.jwt.secretOrKey
};

passport.use(new Strategy(jwtOptions, function(jwt_payload, done) {
    if(jwt_payload) {
    	return done(false, jwt_payload);
    }
    done();
}));

db.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, async (err) => {
		if(err) {
			console.log(err);
		}
		console.log('database connected');

	    app.listen(config.app.port, async () => {
		console.log('app started muslim bey');
	})
});
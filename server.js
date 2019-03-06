const express = require('express');
const exp = express();
//http server app
const app = require('http').Server(exp);
//web socket server app
const io = require('socket.io')(app);
require('./socket/index')(io);
const Redis = require('ioredis');
const redis = new Redis();
require('./socket/workers_subscribers/apache_log_sub')(redis, io);
//файл подключения к БД
const db = require('./db.connect');
//Routes file export
const routes = require('./routes/route');
const cookieParser = require('cookie-parser');
//config file required
const config = require('./config/config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const {initPassportAuth} = require('./http/middlewares/checkAuth');

const { fork } = require('child_process');
fork('./http/workers/getLogsFromRemoteServer');

//static file path
exp.use(express.static(config.app.staticPath));
exp.use(cookieParser());
exp.use(session({
    secret: process.env.SESSION_KEY,
    resave: true,
    // unset: 'destroy',
    domain: 'http://localhost:8080',
    saveUninitialized: false,
    cookie:  {
        path: '/',
        domain: 'http://localhost:8080',
        maxAge: 24 * 6 * 60 * 10000
    },
    store: new MongoStore({url: `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, autoReconnect:true})
}));
//  Connect all our routes to our application
exp.use('/', routes);
//инициализируем авторизацию из подключенного модуля
initPassportAuth();

db.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('database connected');

    app.listen(config.app.port, () => {
        console.log('app started muslim bey');
    })
});
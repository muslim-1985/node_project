const express = require('express');
const exp = express();
//http server app
const app = require('http').Server(exp);
//web socket server app
const io = require('socket.io')(app);
require('./socket/index')(io);
//файл подключения к БД
const db = require('./db.connect');
//Routes file export
const routes = require('./routes/route');
const cookieParser = require('cookie-parser');
//config file required
const config = require('./config/config');
const {initPassportAuth} = require('./http/middlewares/checkAuth');

//static file path
exp.use(express.static(config.app.staticPath));
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
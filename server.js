const express = require('express');
const exp = express();
//http server app
const app = require('http').Server(exp);
//web socket server app
const io = require('socket.io')(app);
require('./socket/index')(io);
//Routes file export
const routes = require('./routes/route');
//config file required
const config = require('./config/config');
const {initPassportAuth} = require('./http/middlewares/checkAuth');

//static file path
exp.use(express.static(config.app.staticPath));
//  Connect all our routes to our application
exp.use('/', routes);
//инициализируем авторизацию из подключенного модуля
initPassportAuth();

app.listen(config.app.port, () => {
    console.log('app started muslim bey');
});

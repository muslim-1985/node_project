module.exports = function(app) {
  const io = require('socket.io')(app);
    io.on('connection', function (socket) {
        socket.emit('news', {my: 'world'});
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
};
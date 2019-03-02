
module.exports = async function(redis, io) {
    let nsp = io.of('/log');
    nsp.on('connection', function(socket){
    console.log('someone connected');
    });
    
    redis.on('message', (channel, message) => {
        nsp.emit('log', message);
        console.log(`Received the following message from ${channel}: ${message}`);
    });
    
    const channel = 'logData';
    
    redis.subscribe(channel, (error, count) => {
        if (error) {
            throw new Error(error);
        }
        console.log(`Subscribed to ${count} channel. Listening for updates on the ${channel} channel.`);
    });
 };
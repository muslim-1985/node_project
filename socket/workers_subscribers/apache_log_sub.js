
module.exports = async function(redis, io) {
    let nsp = io.of('/log');
    let ser  = 0;
    nsp.on('connection', function(socket){
        socket.on('create', function(room) {
            socket.join(room);
            console.log('create' + ser++)
            redis.on('message', async (channel, message) => {
                let result;
                try {
                    result = await JSON.parse(message);
                } catch(e) {
                    console.log(e)
                }
                let mes = await JSON.stringify(result.fileData);
                await nsp.to(result.userId).emit('log', mes);
               // console.log(`Received the following message from ${channel}: ${message}`);
            });
          });
        socket.on('leav', function(room){
            socket.leave(room);
            console.log('leave')
        })  
        console.log('someone connected');
    });
    
    // redis.on('message', (channel, message) => {
    //     nsp.emit('log', message);
    //    // console.log(`Received the following message from ${channel}: ${message}`);
    // });
    
    const channel = 'logData';
    
    redis.subscribe(channel, (error, count) => {
        if (error) {
            throw new Error(error);
        }
        console.log(`Subscribed to ${count} channel. Listening for updates on the ${channel} channel.`);
    });
 };
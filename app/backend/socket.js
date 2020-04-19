const SocketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SocketIO(server);
    
    app.set('io', io);
    const hue = io.of('/hue');
    hue.on('connection', (socket)=>{
        console.log('hue 네임스페이스 접속!');
        socket.on('disconnect', ()=>{
            'hue 네임스페이스 접속 끊김'
        });
    })
}
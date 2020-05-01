const SocketIO = require("socket.io");
const { client } = require("./mqtt");

const logger = require('fluent-logger');
logger.configure('team4', {
  host: '13.125.207.178',
  port: 24224,
  timeout: 3.0,
  reconnectInterval: 600000
})

module.exports = (server, app) => {
  const io = SocketIO(server);

  app.set("io", io);
  const hue = io.of("/hue");
  const temperature = io.of('/temperature');
  const light = io.of('/light');
  const dust = io.of('/dust');
  const flame = io.of('/flame');
  const gas = io.of('/gas');
  const co = io.of('/co');

  const socketList = [hue, temperature, light, dust, flame, gas, co];

  socketList.forEach(element => {
    element.on('connection', (socket)=> {
      console.log(`[sys] ${element.name} 네임스페이스 접속!`);
      client.on('message', (topic, message)=> {
        if(topic === `res${element.name}/update`){
          
          
          // if(topic === 'res/temperature/update') logger.emit('team4', {temp: data2});
          // console.log(`[sys] 웹 소켓으로 ${element.name} 업데이트`);
          const data = JSON.parse(message);
          // logger.emit(data);
          socket.emit('update', JSON.stringify(data));
        }
      })
      element.on('disconnect', ()=>{
        console.log(`[sys] ${element.name} 네임 스페이스 연결 끊김`);
      })
    })
  })
};

const SocketIO = require("socket.io");
const { client } = require("./mqtt");

module.exports = (server, app) => {
  const io = SocketIO(server);

  app.set("io", io);
  const hue = io.of("/hue");
  const temperature = io.of('/temperature');
  const light = io.of('/light');
  const dust = io.of('/dust');
  const flame = io.of('/flame');
  const gas = io.of('/gas');

  const socketList = [hue, temperature, light, dust, flame, gas];

  socketList.forEach(element => {
    element.on('connection', (socket)=> {
      console.log(`[sys] ${element.name} 네임스페이스 접속!`);
      client.on('message', (topic, message)=> {
        console.log(topic);
        if(topic === `res${element.name}/update`){
          console.log(`[sys] 웹 소켓으로 ${element.name} 업데이트`);
          const data = JSON.parse(message);
          socket.emit('update', JSON.stringify(data));
        }
      })
      element.on('disconnect', ()=>{
        console.log(`[sys] ${element.name} 네임 스페이스 연결 끊김`);
      })
    })
  })
};

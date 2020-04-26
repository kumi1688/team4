const SocketIO = require("socket.io");
const { client } = require("./mqtt");

module.exports = (server, app) => {
  const io = SocketIO(server);

  app.set("io", io);
  const hue = io.of("/hue");
  const temperature = io.of('/temperature');
  const light = io.of('/light');
  const dust = io.of('/dust');

  hue.on("connection", (socket) => {
    console.log("[sys] hue 네임스페이스 접속!");
    client.on("message", (topic, message) => {
      if (topic === "res/hue/update") {
        console.log("[sys] 웹 소켓으로 hue 업데이트");
        const data = JSON.parse(message);
        socket.emit("update", JSON.stringify(data));
      }
    });
    socket.on("disconnect", () => {
      console.log("hue 네임스페이스 접속 끊김");
    });
  });
  
  temperature.on('connection', (socket)=>{
    console.log('[sys] temperature 네임스페이스 접속!');
    client.on('message', (topic, message)=>{
      if(topic === 'temperature'){
        console.log('[sys] 웹 소켓으로 temperature 업데이트');
        const data = JSON.parse(message);
        socket.emit('update', JSON.stringify(data));
      }
    });
    socket.on('disconnect', ()=>{
      console.log('temperature 네임스페이스 접속 끊김');
    })
  })

  light.on('connection', (socket)=>{
    console.log('[sys] light 네임스페이스 접속!');
    client.on('message', (topic, message)=>{
      if(topic === 'light'){
        console.log('[sys] 웹 소켓으로 light 업데이트');
        const data = JSON.parse(message);
        socket.emit('update', JSON.stringify(data));
      }
    });
    socket.on('disconnect', ()=>{
      console.log('light 네임스페이스 접속 끊김');
    })
  })
};

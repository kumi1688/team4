const SocketIO = require("socket.io");
const { client } = require("./mqtt");

module.exports = (server, app) => {
  const io = SocketIO(server);

  app.set("io", io);
  const hue = io.of("/hue");
  hue.on("connection", (socket) => {
    console.log("hue 네임스페이스 접속!");

    client.on("message", (topic, message) => {
      if (topic === "res/hue/update") {
        console.log("[sys] 웹 소켓으로 hue 업데이트");
        const data = JSON.parse(message);
        console.log(data);
        socket.emit("update", JSON.stringify(data));
      }
    });

    socket.on("disconnect", () => {
      "hue 네임스페이스 접속 끊김";
    });
  });
};

const SocketIO = require("socket.io");
const { client } = require("./mqtt");

const logger = require("fluent-logger");
logger.configure("team4", {
  host: "13.125.207.178",
  port: 24224,
  timeout: 3.0,
  reconnectInterval: 600000,
});

let alertList = {};

// {
//   deviceInfo: { device: 'buzzer', number: 1 },
//   valueInfo: { type: 'buzzer', value: 'on' }
// }

function getMqttTopic(sensor) {
  console.log(sensor);
  const name = sensor.deviceInfo.device;
  const id = sensor.deviceInfo.number;

  if (name === "hue") {
    return `req/hue/changeStatus/${id}`;
  } else {
    return "BuzzerEvent";
  }
}

function setMqttData(sensor) {
  const name = sensor.deviceInfo.device;
  let data = {};

  if (name === "hue" && sensor.valueInfo.type === "color") {
    data = sensor.valueInfo.value;
    data.on = true;
    return JSON.stringify(data);
  } else if (name === "hue") {
    data[sensor.valueInfo.type] = sensor.valueInfo.value;
    return JSON.stringify(data);
  } else if (name === "buzzer") return "on";
}

module.exports = (server, app) => {
  const io = SocketIO(server);

  app.set("io", io);
  const hue = io.of("/hue");
  const temperature = io.of("/temperature");
  const light = io.of("/light");
  const dust = io.of("/dust");
  const flame = io.of("/flame");
  const gas = io.of("/gas");
  const co = io.of("/co");
  const pir = io.of("/pir");

  const socketList = [hue, temperature, light, dust, flame, gas, co, pir];

  socketList.forEach((element) => {
    const sensor = element.name.split("").slice(1).join("");

    element.on("connection", (socket) => {
      console.log(`[sys] ${element.name} 네임스페이스 접속!`);

      if (!alertList[sensor]) alertList[sensor] = [];
      socket.on("addAlert", (message) => {
        console.log("웹소켓 메시지", JSON.parse(message));
        if (JSON.parse(message).data.length === 0) return;
        alertList[sensor] = [...alertList[sensor], JSON.parse(message)];
      });
      socket.on("removeLink", (id) => {
        console.log("제거할 메시지 id", id);
        alertList[sensor] = alertList[sensor].filter(
          (alert) => alert.id !== id
        );
      });

      client.on("message", (topic, message) => {
        const type = element.name.split("").slice(1).join("");

        if (topic === `res${element.name}/update`) {
          const logData = {};
          logData[type] = JSON.parse(message);
          // logger.emit("team4", logData);
          // console.log(`[sys] 웹 소켓으로 ${element.name} 업데이트`);
          const data = JSON.parse(message);
          // logger.emit(data);
          socket.emit("update", JSON.stringify(data));
          alertList[sensor].forEach((alert) => {
            if (
              alert.condition.criteria === "이상" &&
              data[sensor] > alert.condition.value
            ) {
              alert.data.map((al) =>
                client.publish(getMqttTopic(al), setMqttData(al))
              );
            } else if (
              alert.condition.criteria === "이하" &&
              data[sensor] < alert.condition.value
            ) {
              alert.data.map((al) =>
                client.publish(getMqttTopic(al), setMqttData(al))
              );
            }
          });
        } else if (topic === "temperature" && type === "temperature") {
          const data = {};
          try {
            data[type] = JSON.parse(message);
            socket.emit("update", JSON.stringify(data));
          } catch (e) {
            data[type] = message.toString();
            socket.emit("update", JSON.stringify(data));
          }
        } else if (topic === "light" && type === "light") {
          const data = {};
          try {
            data[type] = JSON.parse(message);
            socket.emit("update", JSON.stringify(data));
          } catch (e) {
            data[type] = message.toString();
            socket.emit("update", JSON.stringify(data));
          }
        } else if (topic === "pir" && type === "pir") {
          const data = {};
          try {
            data[type] = JSON.parse(message);
            data[type] = data[type] === "HIGH" ? 1 : 0;
            socket.emit("update", JSON.stringify(data));
          } catch (e) {
            data[type] = message.toString();
            data[type] = data[type] === "HIGH" ? 1 : 0;
            socket.emit("update", JSON.stringify(data));
          }
        }
      });
      element.on("disconnect", () => {
        console.log(`[sys] ${element.name} 네임 스페이스 연결 끊김`);
      });
    });
  });
};

const SocketIO = require("socket.io");
const { client } = require("./mqtt");
const fs = require('fs');

const logger = require("fluent-logger");
// fluentd 로 전송할 로그 설정
logger.configure("team4", {
  host: "13.125.207.178",
  port: 24224,
  timeout: 3.0,
  reconnectInterval: 600000,
});

let alertList = {};

// 알람에 쓰일 mqtt topic 설정
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

// 알람에 쓰일 mqtt message 설정
function setMqttData(sensor) {
  const name = sensor.deviceInfo.device;
  let data = {};

  if (name === "hue" && sensor.valueInfo.type === "color") { // hue 색 변경
    data = sensor.valueInfo.value;
    data.on = true;
    return JSON.stringify(data);
  } else if (name === "hue") { // hue 이면서 색 변경 이외의 요청
    data[sensor.valueInfo.type] = sensor.valueInfo.value;
    return JSON.stringify(data);
  } else if (name === "buzzer") return "on"; // buzzer의 경우 켜기만 한다
}

// socket 모듈의 진입점
module.exports = (server, app) => {
  const io = SocketIO(server); // 웹 소켓 생성

  app.set("io", io); // app 객체에 웹 소켓 부착
  // 센서마다 웹 소켓 생성
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

    element.on("connection", (socket) => { // 웹 소켓 연결
      console.log(`[sys] ${element.name} 네임스페이스 접속!`);

      if (!alertList[sensor]) alertList[sensor] = []; // 알람 리스트 초기화
      socket.on("addAlert", (message) => { // 알람 추가 
        console.log("웹소켓 메시지", JSON.parse(message));
        if (JSON.parse(message).data.length === 0) return;
        alertList[sensor] = [...alertList[sensor], JSON.parse(message)];
      });
      socket.on("removeLink", (id) => { // 알람 제거
        console.log("제거할 메시지 id", id);
        alertList[sensor] = alertList.map(alert => {
          if (alert.id === id && alert.deviceInfo.device === 'buzzer') client.publish('BuzzerEvent', 'off');
        })
        alertList[sensor] = alertList[sensor].filter(
          (alert) => alert.id !== id
        );
      });
      socket.on('saveRoom', (data) => { // 현재 공간 저장
        fs.writeFileSync('./data/roomList.json', JSON.stringify(data.roomList));
        fs.writeFileSync('./data/deviceList.json', JSON.stringify(data.deviceList));
      })


      client.on("message", (topic, message) => { // mqtt로 메시지가 전송될 때마다 할 일들
        const type = element.name.split("").slice(1).join(""); // 현재 센서 이름

        if (topic === `res${element.name}/update`) { // mqtt로 전송된 센서와 현재 센서의 이름이 일치할 때
          const data = JSON.parse(message);
          checkAlertList(type, data); // 알람이 있는 데이터인지 확인 
          socket.emit("update", JSON.stringify(data)); // 프론트 엔드로 데이터 전송
        } else if (topic === "temperature" && type === "temperature") {
          const data = {};
          try {
            data[type] = JSON.parse(message);
            checkAlertList(type, data); // 알람이 있는 데이터인지 확인
            socket.emit("update", JSON.stringify(data)); // 프론트 엔드로 데이터 전송
            logger.emit('team4', { // fluentd로 로그 전송
              'type': data
            });
          } catch (e) { // JSON type이 아닌 경우. 단순한 String 인 경우 
            data[type] = message.toString();
            checkAlertList(type, data);
            socket.emit("update", JSON.stringify(data));
          }
        } else if (topic === "light" && type === "light") {
          const data = {};
          try {
            data[type] = JSON.parse(message);
            data.record = 'light record'
            checkAlertList(type, data);
            socket.emit("update", JSON.stringify(data));
            logger.emit('team4', {
              'type': data
            });
          } catch (e) {
            data[type] = message.toString();
            checkAlertList(type, data);
            socket.emit("update", JSON.stringify(data));
          }
        } else if (topic === "flame" && type === "flame") {
          const data = {};
          try {
            data[type] = JSON.parse(message);
            data.record = 'flame record'
            checkAlertList(type, data);
            socket.emit("update", JSON.stringify(data));
            logger.emit('team4', {
              'type': data
            });
          } catch (e) {
            data[type] = message.toString();
            checkAlertList(type, data);
            socket.emit("update", JSON.stringify(data));
          }
        } else if (topic === "gas" && type === "gas") {
          const data = {};
          try {
            data[type] = JSON.parse(message);
            data.record = 'gas record'
            checkAlertList(type, data);
            socket.emit("update", JSON.stringify(data));
            logger.emit('team4', {
              'type': data
            });
          } catch (e) {
            data[type] = message.toString();
            checkAlertList(type, data);
            socket.emit("update", JSON.stringify(data));
          }
        } else if (topic === "co" && type === "co") {
          const data = {};
          try {
            data[type] = JSON.parse(message);
            data.record = 'gas record'
            checkAlertList(type, data);
            socket.emit("update", JSON.stringify(data));
            logger.emit('team4', {
              'type': data
            });
          } catch (e) {
            data[type] = message.toString();
            checkAlertList(type, data);
            socket.emit("update", JSON.stringify(data));
          }
        } else if (topic === "pir" && type === "pir") {
          const data = {};
          try {
            data[type] = JSON.parse(message);
            data[type] = data[type] === "HIGH" ? 1 : 0;
            checkAlertList(type, data);
            socket.emit("update", JSON.stringify(data));
          } catch (e) {
            data[type] = message.toString();
            data[type] = data[type] === "HIGH" ? 1 : 0;
            checkAlertList(type, data);
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

// 알람 확인하는 함수 
function checkAlertList(type, data) {
  alertList[type].forEach((alert) => { // 현재 알람 리스트 중에서
    if (alert.condition.criteria === "이상" && data[type] > alert.condition.value) { // 알람 기준에 해당되면
      alert.data.map((al) => client.publish(getMqttTopic(al), setMqttData(al))); // 알람에 해당하는 장비 동작
    } else if (alert.condition.criteria === "이하" && data[type] < alert.condition.value) { // 알람 기준에 해당되면
      alert.data.map((al) => client.publish(getMqttTopic(al), setMqttData(al))); // 알람에 해당하는 장비 동작 
    }
  });
}
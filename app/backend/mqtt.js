const mqtt = require("mqtt");
const options = {
  host: "13.125.207.178",
  port: 1883,
  protocol: "mqtt",
};
const fs = require('fs')

// subscribe 할 topic 목록
const subscribeList = [
  "res/hue/property", // 속성 정보 요청 응답
  "res/hue/status", // 현재 상태 정보 요청 응답
  "res/hue/update", // hue 쪽에서 상태값이 변경될 때 마다 상태값 받음
  "res/weather/weather", // 현재 날씨 요청 응답
  "res/weather/dust", // 미세 먼지 요청 응답
  "req/dust",
  "res/hue/changeStatus/+",
  "req/temperature/status",
  "req/light/status",
  "res/dust/update",
  "res/light/update",
  "res/flame/update",
  "res/gas/update",
  "res/temperature/update",
  "res/co/update",
  "res/pir/update",
  "clova/req/hue/status",
  "clova/req/hue/changeStatus/+",
  "pir",
  "temperature",
  "light",
  'gas',
  'co',
  'flame',
  'clova/req/room',
  'clova/req/hueAssignInfo',
  'clova/req/room/changeStatus',
  'clova/req/changeHueRoom'
];

// publish 할 topic 목록
let publishList = [
  "req/hue/property", // 속성 정보 요청
  "req/hue/status/+", // 현재 상태 정보 요청
  "req/hue/changeStatus/+", // 현재 상태 변경 요청
  "req/weather/dust", // 미세먼지 요청
  "req/weather/weather", // 현재 날씨 요청
];

// hue 속성
let hueProperty = {};

//mqtt 연결
const client = mqtt.connect(options);
client.setMaxListeners(100); // mqtt에 물릴 최대 listener 증설. 늘리지 않으면 mqtt 수신이 안 될 수 있다

client.on("connect", () => {
  console.log("[sys] mqtt 연결됨");
});
client.on("disconnect", () => {
  console.log("[sys] mqtt 연결 끊김");
});

// subscribe 일괄 적용
subscribeList.forEach(function (topic) {
  client.subscribe(topic);
});

// 처음 로딩시 속성 요청
client.publish("req/hue/property", "");

// 현재 속성값 전달.
function getHueProperty() {
  return hueProperty;
}

// 현재 상태값 받아오는 함수. 비동기 처리로 데이터를 받아옴
function requestData(pubTopic, pubMessage) {
  return new Promise((resolve, reject) => {
    try {
      client.publish(pubTopic, pubMessage, {}, () => {
        client.on("message", (subTopic, subMessage) => {
          if (
            pubTopic.split("/").splice(1).join("") ===
            subTopic.split("/").splice(1).join("")
          ) {
            // console.log(JSON.parse(subMessage));
            resolve(JSON.parse(subMessage));
          }
        });
      });
    } catch (e) {
      console.error(e);
    }
  });
}

// mqtt topic 별로 처리할 로직
client.on("message", async (topic, message) => {
  const clovaTopic = topic.split("/");
  if (clovaTopic[0] === "clova") { // clova 서버에서 요청이 들어오는 경우
    if (topic === "clova/req/hue/status") { // clova 서버에서 전구 1개의 상태를 확인하는 경우
      const result = await requestData(clovaTopic.slice(1).join("/"));
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      client.publish(pubTopic, JSON.stringify(result));
    } else if (topic === "clova/req/hue/changeStatus") { // clova 서버에서 전구 1개의 상태를 변경하는 경우 
      const result = await requestData(clovaTopic.slice(1).join("/"));
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      client.publish(pubTopic, JSON.stringify(result));
    } else if (topic === "clova/req/room") { // clova 서버에서 방 리스트를 요청하는 경우 
      const result = JSON.parse(fs.readFileSync('./data/roomList.json'));
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      client.publish(pubTopic, JSON.stringify(result));
    } else if (topic === 'clova/req/hueAssignInfo') { // clova 서버에서 방 마다 배치된 전구의 리스트를 요청하는 경우
      const room = JSON.parse(message);
      const result = JSON.parse(fs.readFileSync('./data/deviceList.json'));
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      const data = result.hue[room.value] ? result.hue[room.value] : []
      client.publish(pubTopic, JSON.stringify(data));
    } else if (topic === 'clova/req/changeHueRoom') { // clova 서버에서 방에 배치된 전체 전구 상태 변경을 요청하는 경우
      const result = JSON.parse(message);
      const deviceList = JSON.parse(fs.readFileSync('./data/deviceList.json'));
      const data = { on: result.on ? true : false, numlist: deviceList.hue[result.room.value] };
      console.log(data);
      client.publish('req/hue/changeAllStatus', JSON.stringify(data));
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      client.publish(pubTopic, JSON.stringify({ result: 'success' }));
    } else { // 이 외에 일반 응답은 무의미한 요청이므로 응답메시지만 전송
      const data = JSON.parse(message);
      const result = await requestData(
        clovaTopic.slice(1).join("/"),
        JSON.stringify(data)
      );
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      client.publish(pubTopic, JSON.stringify(result));
    }
  } else if (topic === "res/hue/property") { // clova 서버가 아닌 곳에서 hue 속성을 요청하는 경우
    hueProperty = JSON.parse(message);
  }
});

module.exports = {
  client,
  getHueProperty, // 속성 정보 요청
  requestData, // 현재 상태 정보 요청. 비동기 처리 (최신 정보 받아옴)
};

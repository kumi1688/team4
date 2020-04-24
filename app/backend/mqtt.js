const mqtt = require("mqtt");
const options = {
  host: "13.125.207.178",
  port: 1883,
  protocol: "mqtt",
};

// subscribe 할 topic 목록
let subscribeList = [
  "res/hue/property", // 속성 정보 요청 응답
  "res/hue/status2", // 현재 상태 정보 요청 응답
  "res/hue/update", // hue 쪽에서 상태값이 변경될 때 마다 상태값 받음
  "res/weather/weather", // 현재 날씨 요청 응답
  "res/weather/dust", // 미세 먼지 요청 응답
  "req/dust",
  "temperature",
  "light",
];
// publish 할 topic 목록
let publishList = [
  "req/hue/property", // 속성 정보 요청
  "req/hue/status", // 현재 상태 정보 요청
  "req/hue/changeStatus/+", // 현재 상태 변경 요청
  "req/weather/dust", // 미세먼지 요청
  "req/weather/weather", // 현재 날씨 요청
];

// hue 속성
let hueProperty = {};
let hueStatus = [];
//mqtt 연결
const client = mqtt.connect(options);
client.on("connect", () => {
  console.log("mqtt 연결됨");
});
client.on("disconnect", () => {
  console.log("mqtt 연결 끊김");
});

// subscribe 일괄 적용
subscribeList.forEach(function (topic) {
  client.subscribe(topic);
});

// 처음 로딩시 속성과 초기상태 요청
client.publish("req/hue/property", "");
// client.publish("req/hue/status", "");

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

client.on("message", (topic, message) => {
  if (topic === "res/hue/property") {
    hueProperty = JSON.parse(message);
  } else if (topic === "req/dust") {
    console.log(JSON.parse(message));
  } else if (topic === "temperature") {
    console.log(JSON.parse(message));
  } else if (topic === "light") {
    console.log(JSON.parse(message));
  }
});

module.exports = {
  client,
  getHueProperty, // 속성 정보 요청
  requestData, // 현재 상태 정보 요청. 비동기 처리 (최신 정보 받아옴)
};

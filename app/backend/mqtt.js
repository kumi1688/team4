const mqtt = require("mqtt");
const options = {
  host: "13.125.207.178",
  port: 1883,
  protocol: "mqtt",
};

// subscribe 할 topic 목록
let subscribeList = [
  "res/hue/property", // 속성 정보 요청 응답
  "res/hue/status", // 현재 상태 정보 요청 응답
  "res/hue/update", // hue 쪽에서 상태값이 변경될 때 마다 상태값 받음
  "res/weather/weather", // 현재 날씨 요청 응답
  "res/weather/dust", // 미세 먼지 요청 응답
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
// hue 현재 상태
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
client.publish("req/hue/status", "");

client.on("message", (topic, message) => {
  console.log("topic : ", topic);
  if (topic === "res/hue/property") {
    // 속성 전송
    hueProperty = JSON.parse(message);
  } else if (topic === "res/hue/status") {
    // 초기 상태 전송
    hueStatus = JSON.parse(message);
  }
});

// 현재 속성값 전달.
function getHueProperty() {
  return hueProperty;
}

// 현재 상태값 전달. 비동기 처리가 되지 않아 최신 정보 아닐 수 있음
function getHueStatus() {
  return hueStatus;
}

// 현재 상태값 받아오는 함수. 비동기 처리로 데이터를 받아옴
function requestData(pubTopic, pubMessage) {
  return new Promise((resolve, reject) => {
    client.publish(pubTopic, pubMessage, {}, () => {
      client.on("message", (subTopic, subMessage) => {
        console.log("subTopic: ", subTopic);
        // publish topic 과 subscribe topic이 같아야 한다
        if (
          pubTopic.split("/").splice(1).join("/") ===
          subTopic.split("/").splice(1).join("/")
        ) {
          // hueStatus = JSON.parse(subMessage);
          resolve(JSON.parse(subMessage));
        }
      });
    });
  });
}

module.exports = {
  client,
  getHueProperty, // 속성 정보 요청
  getHueStatus, // 현재 상태 정보 요청 (정보가 최신이 아닐 수 있음)
  requestData, // 현재 상태 정보 요청. 비동기 처리 (최신 정보 받아옴)
};

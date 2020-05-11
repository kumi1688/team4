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
client.setMaxListeners(100);

if (client.listenerCount("connect") > 1) {
  client.removeListener("connect", client);
}

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

client.on("message", async (topic, message) => {
  const clovaTopic = topic.split("/");
  // console.log(topic)
  if (clovaTopic[0] === "clova") {
    if (topic === "clova/req/hue/status") {
      const result = await requestData(clovaTopic.slice(1).join("/"));
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      client.publish(pubTopic, JSON.stringify(result));
    } else if (topic === "clova/req/hue/changeStatus") {
      console.log("나는 9번이다");
      const result = await requestData(clovaTopic.slice(1).join("/"));
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      client.publish(pubTopic, JSON.stringify(result));
    } else if (topic === "clova/req/room") {
      console.log('방을 확인합니다');
      const result = JSON.parse(fs.readFileSync('./data/roomList.json'));
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      client.publish(pubTopic, JSON.stringify(result));
    } else if(topic === 'clova/req/hueAssignInfo'){
      console.log('방에 배치된 전구를 확인합니다');
      const room = JSON.parse(message);
      const result = JSON.parse(fs.readFileSync('./data/deviceList.json'));
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      const data = result.hue[room.value] ? result.hue[room.value] : []
      client.publish(pubTopic, JSON.stringify(data));
    } else if ( topic === 'clova/req/changeHueRoom'){
      const result = JSON.parse(message);
      console.log(`${result.room.value}에 배치된 전구를 ${result.on ? '켭니다':'끕니다'}`);
      const deviceList = JSON.parse(fs.readFileSync('./data/deviceList.json'));
      const data = {on: result.on ? true:false, numlist: deviceList.hue[result.room.value]};
      console.log(data);
      client.publish('req/hue/changeAllStatus', JSON.stringify(data));
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      client.publish(pubTopic, JSON.stringify({result: 'success'}));
    }
    
    
    else {
      const data = JSON.parse(message);
      const result = await requestData(
        clovaTopic.slice(1).join("/"),
        JSON.stringify(data)
      );
      const pubTopic = ["clova", "res", ...clovaTopic.slice(2)].join("/");
      client.publish(pubTopic, JSON.stringify(result));
    }
  } else if (topic === "res/hue/property") {
    hueProperty = JSON.parse(message);
  }
});

module.exports = {
  client,
  getHueProperty, // 속성 정보 요청
  requestData, // 현재 상태 정보 요청. 비동기 처리 (최신 정보 받아옴)
};

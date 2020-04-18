const mqtt = require('mqtt');
const options = {
    host: '192.168.0.14',
    port: 1883,
    protocol: 'mqtt'
}
// subscribe 할 topic 목록
let subscribeList = [
    'res/hue/config', // 속성 정보 요청 응답
    'res/hue/status', // 현재 정보 요청 응답
];
// publish 할 topic 목록
let publishList = [
    'req/hue/config',
    'req/hue/status'
];
// hue 속성
let hueConfig = {};
// hue 상태
let hueStatus = [];

//mqtt 연결
const client = mqtt.connect(options);
client.on('connect', () => {
    console.log('mqtt 연결됨');
});
client.on('disconnect', () => {
    console.log('mqtt 연결 끊김');
})

// subscribe 일괄 적용
subscribeList.forEach(function(topic){
    client.subscribe(topic);
});

client.publish('req/hue/config', '');
client.publish('req/hue/status', '');

client.on('message', (topic, message)=>{
    if(topic === 'res/hue/config'){
        hueConfig = JSON.parse(message);
        // console.log(hueConfig);
    }else if (topic === 'res/hue/status'){
        hueStatus = JSON.parse(message);
        // console.log(hueStatus);
    }
})

function getHueConfig(){
    return hueConfig;
}
function getHueStatus(){
    return hueStatus;
}

module.exports = {
    client, getHueConfig, getHueStatus
}
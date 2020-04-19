const mqtt = require('mqtt');
const options = {
    host: '192.168.0.14',
    port: 1883,
    protocol: 'mqtt'
}
// subscribe 할 topic 목록
let subscribeList = [
    'res/hue/property', // 속성 정보 요청 응답
    'res/hue/status', // 현재 상태 정보 요청 응답
    'res/hue/status/update' // hue 쪽에서 상태값이 변경될 때 마다 상태값 받음
];
// publish 할 topic 목록
let publishList = [
    'req/hue/property', // 속성 정보 요청 
    'req/hue/status', // 현재 상태 정보 요청 
    'req/hue/changeStatus/+', // 현재 상태 변경 요청
];

// hue 속성
let hueProperty = {};
// hue 현재 상태
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

// 처음 로딩시 속성과 초기상태 요청
client.publish('req/hue/property', '');
client.publish('req/hue/status', '');

client.on('message', (topic, message)=>{
    console.log('topic : ', topic);
    if(topic === 'res/hue/property'){
        hueProperty = JSON.parse(message);
    }else if (topic === 'res/hue/status'){
        hueStatus = JSON.parse(message);
    }else if (topic === 'res/hue/status/update'){
        console.log('update');
        hueStatus = JSON.parse(message);
        
    }
})

function getHueProperty(){
    return hueProperty;
}
function getHueStatus(){
    return hueStatus;
}

function requestHueData(pubTopic, pubMessage){
    return new Promise((resolve, reject)=>{
        client.publish(pubTopic, pubMessage, {}, () => {
           client.on('message', (subTopic, subMessage)=>{
               console.log('subTopic: ', subTopic)
               // publish topic 과 subscribe topic이 같아야 한다
               if(pubTopic.split('/').splice(1).join('/') === subTopic.split('/').splice(1).join('/')){
                hueStatus = JSON.parse(subMessage);
                resolve(hueStatus);     
               } 
           }) 
        });
    })
}


module.exports = {
    client, 
    getHueProperty, // 속성 정보 요청
    getHueStatus,  // 현재 상태 정보 요청 (정보가 최신이 아닐 수 있음)
    requestHueData // 현재 상태 정보 요청 (최신 정보 받아옴)
}
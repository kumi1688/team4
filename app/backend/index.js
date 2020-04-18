var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');

const {client} = require('./mqtt');   //mqtt client 모듈
var lights = require('./routes/light'); //light 라우터

var hueStatus = lights.status   //hue들의 상태 정보를 갖고있는 배열
var hueProperties = lights.properties   //hue 속성 정보 객체

//socket.io 부분
// app.io = require("socket.io")();
// const socket = app.io.on("connection", function () {
//   console.log("웹 소켓 연결됨");

//   let count = 0;
//   setInterval(() => {

//     socket.emit("bulbState", {
//       data: `전구 상태 : ${count++}`,
//     });
//   }, 2000);
// });

//mqtt 부분
// client.on("connect", () => {
//   console.log("connected : " + client.connected);
// })

// client.on("error", (error) => {
//   console.log("Can't connect : " + error);
// })

// client.on('message', (topic, message, packet) => {
//   //console.log("message is " + JSON.parse(message))
//   console.log("topic is " + topic)
//   if(topic == 'philstatus'){
//     message = JSON.parse(message);    
//     for(var i=0; i<hueStatus.length; i++){
//       if(hueStatus[i].number == message.number){  //message.number에 해당하는 hue의 상태 업데이트
//         hueStatus[i].power = message.power;
//         hueStatus[i].hue = message.hue;
//         hueStatus[i].brightness = message.brightness;
//         hueStatus[i].saturation = message.saturation;
//         hueStatus[i].colorTemperature = message.colorTemperature;
//       }
//     }
//   }else if(topic == 'philinit'){
//     //console.log("속성")
//     hueProperties = JSON.parse(message)
//     //console.log(properties);

//     hueStatus = [] //hue들의 상태 정보 초기화
//     for(var i=0; i<hueProperties.device; i++){
//       hueStatus.push({number:hueProperties.number[i]}) //hue 번호를 hueStatus 배열에 저장
//       client.publish("philipshue/"+(i+1), "state")   //각 조명의 상태 요청
//     }
//   }
// })

// client.subscribe("philinit"); //조명 속성 정보
// client.subscribe("philstatus");    //조명 상태

// client.publish("philipshue/1", "initstatus")    //처음 로딩됐을 때 조명 속성 정보 요청, philinit 토픽으로 받음

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.json()) //request body를 json 타입으로 읽기, 만약 선언되지 않으면 request body를 읽을수 없다.
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/light', lights);

var server = http.listen(8080, function () {
  console.log("Server Created...");
});

// app.io.attach(server);

//Close
process.on("SIGINT", function () {
  client.end()
  console.log("Get SIGINT!\n")
  process.exit()
})
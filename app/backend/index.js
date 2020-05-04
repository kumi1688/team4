var express = require("express");
var app = express();
var http = require("http").createServer(app);
var path = require("path");
var bodyParser = require("body-parser");
const fs =require('fs');
var cors = require("cors");
var dotenv = require('dotenv');
// const logger = require('fluent-logger');
// logger.configure('team4', {
//   host: '13.125.207.178',
//   port: 24224,
//   timeout: 3.0,
//   reconnectInterval: 600000
// })

dotenv.config();

const websocket = require("./socket");

const hue = require("./routes/hue"); //light 라우터
const weather = require("./routes/weather"); // weather 라우터
const light = require('./routes/light');
const temperature = require('./routes/temperature');
const co = require('./routes/co');
const gas = require('./routes/gas');
const flame = require('./routes/flame');
const dust = require('./routes/dust');
const buzzer = require('./routes/buzzer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.json()); //request body를 json 타입으로 읽기, 만약 선언되지 않으면 request body를 읽을수 없다.
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/hue", hue);
app.use("/weather", weather);
app.use('/dust', dust);
app.use('/co', co);
app.use('/light', light);
app.use('/temperature', temperature);
app.use('/gas', gas);
app.use('/flame', flame);
app.use('/buzzer', buzzer);

app.get('/sensorList', (req, res)=>{
  const sensorList = ['dust', 'co', 'light', 'temperature', 'gas', 'flame'];
  res.send(sensorList);
})

app.get('/deviceList', (req, res)=>{
  const deviceList = ['hue', 'buzzer'];
  res.send(deviceList);
})

var server = http.listen(process.env.basePort, function () {
  console.log("Server Created...");
});

websocket(server, app);

//Close
process.on("SIGINT", function () {
  console.log("Get SIGINT!\n");
  process.exit();
});

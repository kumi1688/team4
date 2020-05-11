var express = require("express");
var app = express();
var http = require("http").createServer(app);
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");
var dotenv = require("dotenv");
const logger = require('fluent-logger');
logger.configure('team4', {
  host: '13.125.207.178',
  port: 24224,
  timeout: 3.0,
  reconnectInterval: 600000
})

dotenv.config();

const websocket = require("./socket"); // 웹 소켓과 관련된 모듈은 따로 분리하기

// 각각의 센서와 장비에 관련된 http 요청을 처리하는 라우터 분리 
const hue = require("./routes/hue");
const weather = require("./routes/weather");
const light = require("./routes/light");
const temperature = require("./routes/temperature");
const co = require("./routes/co");
const gas = require("./routes/gas");
const flame = require("./routes/flame");
const dust = require("./routes/dust");
const buzzer = require("./routes/buzzer");
const pir = require("./routes/pir");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.json()); //request body를 json 타입으로 읽기, 만약 선언되지 않으면 request body를 읽을수 없다.
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// 센서 및 장비 별 라우터 사용 
app.use("/hue", hue);
app.use("/weather", weather);
app.use("/dust", dust);
app.use("/co", co);
app.use("/light", light);
app.use("/temperature", temperature);
app.use("/gas", gas);
app.use("/flame", flame);
app.use("/buzzer", buzzer);
app.use("/pir", pir);

// 센서 리스트 요청이 들어오는 경우 센서 리스트 전송
app.get("/sensorList", (req, res) => {
  const sensorList = ["dust", "co", "light", "temperature", "gas", "flame", "pir",];
  res.send(sensorList);
});

// 장비 리스트 요청이 들어오는 경우 장비 리스트 전송
app.get("/deviceList", (req, res) => {
  const deviceList = ["hue", "buzzer"];
  res.send(deviceList);
});

// 기본 포트는 8080 .env 파일에 BASE_PORT로 저장함
var server = http.listen(process.env.BASE_PORT, function () {
  console.log("Server Created...");
});

websocket(server, app); // 웹 소켓 모듈은 server와 app 객체를 모두 참조하므로 필요함 

//서버를 강제 종료할 경우 실행하는 함수
process.on("SIGINT", function () {
  console.log("Get SIGINT!\n");
  process.exit();
});

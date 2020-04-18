var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');

var lights = require('./routes/light'); //light 라우터

// socket.io 부분

app.io = require("socket.io")();
const socket = app.io.on("connection", function () {
  console.log("웹 소켓 연결됨");

  let count = 0;
  setInterval(() => {

    socket.emit("bulbState", {
      data: `전구 상태 : ${count++}`,
    });
  }, 2000);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.json()) //request body를 json 타입으로 읽기, 만약 선언되지 않으면 request body를 읽을수 없다.
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/light', lights);

var server = http.listen(8080, function () {
  console.log("Server Created...");
});

app.io.attach(server);

//Close
process.on("SIGINT", function () {
  client.end()
  console.log("Get SIGINT!\n")
  process.exit()
})
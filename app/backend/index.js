var express = require("express");
var app = express();
var http = require("http").createServer(app);
var path = require("path");
var bodyParser = require("body-parser");
var cors = require("cors");
const websocket = require("./socket");

const lights = require("./routes/light"); //light 라우터
const weather = require("./routes/weather"); // weather 라우터

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.json()); //request body를 json 타입으로 읽기, 만약 선언되지 않으면 request body를 읽을수 없다.
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/light", lights);
app.use("/weather", weather);

var server = http.listen(8080, function () {
  console.log("Server Created...");
});

websocket(server, app);

//Close
process.on("SIGINT", function () {
  console.log("Get SIGINT!\n");
  process.exit();
});

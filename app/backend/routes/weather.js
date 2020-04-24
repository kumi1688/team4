var express = require("express");
var router = express.Router();
const { requestData } = require("../mqtt");

// const dustSample = require("../data/dustData_sample.json");
router.get("/dust", async function (req, res) {
  const { station } = req.query;
  const data = {
    station,
  };
  console.log(req.params);
  const result = await requestData("req/weather/dust", JSON.stringify(data));
  //   const result = getHueProperty();
  res.send(result);
});

// 서울특별시 종로구 청운효자동
// 충청북도 청주시청원구 내덕1동
// const weatherSample = require("../data/weatherData_sample.json");
router.get("/weather", async function (req, res) {
  console.log("weather", req.query);
  const data = {
    ...req.query,
  };
  const result = await requestData("req/weather/weather", JSON.stringify(data));
  res.send(result);
});

module.exports = router;

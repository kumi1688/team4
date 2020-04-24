var express = require("express");
var router = express.Router();
const {
  getHueProperty,
  getHueStatus,
  requestData,
  client,
} = require("../mqtt");

// 속성 전달
router.get("/property", async function (req, res) {
  // const result = await requestHueData('req/hue/config');
  const result = getHueProperty();
  res.send(result);
});

// 현재 상태 전달
router.get("/status", async function (req, res) {
  const result = await requestData("req/hue/status");
  // 웹소켓 연결
  // const io = req.app.get('io');
  // const result = getHueStatus();
  // io.of('/hue').emit('hue', result)
  res.send(result);
});

// 상태 변경
router.put("/:id", function (req, res) {
  const id = req.params.id;
  const sendData = { ...req.body };

  client.publish(`req/hue/changeStatus/${id}`, JSON.stringify(sendData));
  res.send("ok");
});

module.exports = router;

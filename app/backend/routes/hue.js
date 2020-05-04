var express = require("express");
var router = express.Router();
const { getHueProperty, requestData, client } = require("../mqtt");

let alertList= [];
// 속성 전달
router.get("/property", async function (req, res) {
  const result = getHueProperty();
  res.send(result);
});

// 현재 상태 전달
router.get("/status", async function (req, res) {
  const result = await requestData("req/hue/status2");
  res.send(result);
  // 웹소켓 연결
  // const io = req.app.get('io');
  // const result = getHueStatus();
  // io.of('/hue').emit('hue', result)
});

// 상태 변경
router.put("/:id", function (req, res) {
  const id = req.params.id;
  const sendData = { ...req.body };

  client.publish(`req/hue/changeStatus/${id}`, JSON.stringify(sendData));
  res.send("ok");
});

router.post('/:id', function(req, res){
  const id = req.params.id;
  const sendData = {...req.body, id: id, valid: true};
  
  
  alertList= [...alertList, sendData];
})

setInterval(()=>{
  alertList.forEach(alert => {
    console.log(alert)
    if(alert.value > 0) alert.value -= 1;
    else if ( alert.value === 0 && alert.valid){
      alert.valid = false
      const sendData = {...alert};
      delete sendData.id
      delete sendData.valid
      console.log(alert.id, sendData);
      client.publish(`req/hue/changeStatus/${alert.id}`, JSON.stringify(sendData))
    }
  })
}, 1000);

module.exports = router;
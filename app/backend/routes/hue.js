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
router.put("/change/:id", function (req, res) {
  const id = req.params.id;
  const sendData = { ...req.body };

  client.publish(`req/hue/changeStatus/${id}`, JSON.stringify(sendData));
  res.sendStatus(200);
});

router.put('/changeAll', function(req,res){
  const sendData = {...req.body};
  console.log(sendData)
  client.publish(`req/hue/changeAllStatus`, JSON.stringify(sendData));
  res.sendStatus(200);
})

router.post('/:id', function(req, res){
  const id = req.params.id;
  const sendData = {...req.body, id: id, valid: true};
  
  alertList= [...alertList, sendData];
  res.sendStatus(200);
})

setInterval(()=>{
  alertList.forEach(alert => {
    if(alert.value > 0) alert.value -= 1;
    else if ( alert.value === 0 && alert.valid){
      alert.valid = false
      const sendData = {...alert};
      console.log(sendData)
      if(sendData.type && sendData.type !== 'color') sendData[sendData.type] = sendData.optionValue
      else if (sendData.type === 'color') {
        sendData.hue = sendData.optionValue.hue;
        sendData.sat = sendData.optionValue.sat;
        sendData.bri = sendData.optionValue.bri;
      }

      delete sendData.id
      delete sendData.valid;
      delete sendData.type;
      delete sendData.value;
      delete sendData.optionValue;
      
      console.log(sendData);
      client.publish(`req/hue/changeStatus/${alert.id}`, JSON.stringify(sendData))
    }
  })
  alertList = alertList.filter(alert => alert.valid)
}, 1000);

module.exports = router;
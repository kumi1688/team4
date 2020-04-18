var express = require('express');
var router = express.Router();
const {getHueConfig, getHueStatus} = require('../mqtt');

router.status = []  //hue들의 상태 정보를 갖고있는 배열
router.properties = {}  //hue 속성 정보 객체

router.get("/config", function (req, res) {
    console.log(getHueConfig(), getHueStatus());
    res.sendStatus(200);
    // console.log(JSON.stringify(router.status));
    // res.send(JSON.stringify(router.status))
})

// router.put("/:id", function (req, res) {
//     var id = req.params.id;
//     var num
//     for(var i=0; i<router.status.length; i++){
//       if(router.status[i].number == id){
//         num = i+1
//       }
//     }   //조명 번호에 따라 topic에 사용할 숫자를 바꿔주기 위한 부분...
//     /*if(id == 9){
//       num = 1;
//     }else if(id == 11){
//       num = 2;
//     }*/
//     var sendData = {}
//     sendData.power = req.body.power;
//     sendData.brightness = req.body.brightness;
//     sendData.hue = req.body.hue;
//     sendData.saturation = req.body.saturation;
//     sendData.colorTemperature = req.body.colorTemperature;
//     client.publish("philipshue/"+num, JSON.stringify(sendData))
  
//     res.send('ok')
// })
  


// //지금 power, hue, brightness, saturation, colorTemperature 다 한 번에 보내는 걸로 했는데
// //나눠서 보내는 게 좋을 것 같아서 나눠서 씀
// router.put("/power/:id", function (req, res) {
//     var id = req.params.id;
//     var num
//     for(var i=0; i<router.status.length; i++){
//       if(router.status[i].number == id){
//         num = i+1
//       }
//     }
//     var sendData = {}
//     sendData.power = req.body.power;
//     client.publish("philipshue/"+num, JSON.stringify(sendData))
  
//     res.send('ok')
// })
  
// router.put("/color/:id", function (req, res) {
//     var id = req.params.id;
//     var num
//     for(var i=0; i<router.status.length; i++){
//       if(router.status[i].number == id){
//         num = i+1
//       }
//     }
//     var sendData = {}
//     sendData.brightness = req.body.brightness;
//     sendData.hue = req.body.hue;
//     sendData.saturation = req.body.saturation;
//     client.publish("philipshue/"+num, JSON.stringify(sendData))
  
//     res.send('ok')
// })
  
// router.put("/temperature/:id", function (req, res) {
//     var id = req.params.id;
//     var num
//     for(var i=0; i<router.status.length; i++){
//       if(router.status[i].number == id){
//         num = i+1
//       }
//     }
//     var sendData = {}
//     sendData.colorTemperature = req.body.colorTemperature;
//     client.publish("philipshue/"+num, JSON.stringify(sendData))
  
//     res.send('ok')
// })

// //hue 속성 정보 보내기
// router.get("/property", function (req, res) {
//     res.send(JSON.stringify(router.properties));
// })

module.exports = router;

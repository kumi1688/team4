var express = require("express");
var router = express.Router();

// 속성 전달
// const property = require('../property/buzzer.json');

router.get("/property", function (req, res) {
  const property = {
    number : [2,4]
  }
  res.send(property);
});

module.exports = router;
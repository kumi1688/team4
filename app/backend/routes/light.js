var express = require("express");
var router = express.Router();

// 속성 전달
const property = require('../property/light.json');

router.get("/property", function (req, res) {
  res.send(property);
});

module.exports = router;

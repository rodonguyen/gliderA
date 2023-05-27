var express = require('express');
var router = express.Router();
require("dotenv").config();


/* GET users listing. */
router.get('/', function(req, res) {
  res.status(200).json({message: 'This is /account endpoint.'})
})

module.exports = router;

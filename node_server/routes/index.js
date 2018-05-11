var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
// fix: make it work for front end routing
router.use(function(req, res, next) {
  res.sendFile('index.html', { root: path.join(__dirname, '../../tap-news/build/') })
});

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
  title: 'travel_mobil',
  success: req.query.success || null
  });
  });
  
module.exports = router;
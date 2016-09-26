var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api/newPaymentLink', function(req, res, next) {
  res.render('apis', { title: 'APIs' });
});

module.exports = router;

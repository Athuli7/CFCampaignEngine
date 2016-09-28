var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/api/newPaymentLink', function(req, res, next) {
	var response;
	response.link="http://Cross";
	res.send(JSON.stringfy(response));
});

module.exports = router;

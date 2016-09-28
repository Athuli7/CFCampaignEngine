////slashAPI Router
//Includes
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var request = require('request');
var express = require('express');
var path = require('path');

//Vars
var router = express.Router();
var parserObj = bodyParser.urlencoded({ extended: true });
var jsonOutputObj = {};
var varDump = {};

//Config
var siteConfig = require('./../config/site.json');

//Routing
router.post('/newPayment', parserObj, function (req,res){
	//Parse Parametres
	var reqParams = req.body;
	var paymentRequestURL = siteConfig.payment[0].url;
	var mode = siteConfig.payment[0].profile;
	//Request Link from Payment Gateway
	var options = {
		method : "POST",
		url: paymentRequestURL.replace('${host}',siteConfig.payment[0].profiles[mode].host),
		headers: {},
		form:{}
	};
	for (var key in siteConfig.payment[0].form){
		options.form[key]=siteConfig.payment[0].form[key];
		for (var a in siteConfig.meta){
			var temp = siteConfig.meta[a];
			options.form[key] = options.form[key].replace('@{'+a+'}',temp);
		}
		for (var a in reqParams){
			var temp = reqParams[a];
			options.form[key] = options.form[key].replace('#{'+a+'}',temp);
		}
	}
	for (var key in siteConfig.payment[0].headers){
		options.headers[key]=siteConfig.payment[0].profiles[mode][siteConfig.payment[0].headers[key]];
	}
	function callback(error, response, body) {
		//Structure Response
		jsonOutputObj={};
		varDump = {};
		varDump['reqParams']=reqParams;
		varDump['reqBody']=req.body;
		varDump['error']=error;
		varDump['response']=response;
		varDump['body']=body;
		varDump['request']=options;
		console.log(response);
		jsonOutputObj['status']=JSON.parse(response.body).success;
		jsonOutputObj['link']=JSON.parse(response.body).payment_request.longurl;
		jsonOutputObj['varDump']=varDump;
		//Send Response
		res.setHeader('Content-Type', 'application/json')
		res.end(JSON.stringify(jsonOutputObj));	
	}
	request(options, callback);
});

router.post('/checkPayment', parserObj, function (req,res){
	//Parse Parametres
	var paymentCheckURL = siteConfig.payment[0].url+req.body.payment_request_id;
	var mode = siteConfig.payment[0].profile;
	//Request Link from Payment Gateway
	var options = {
		method : "GET",
		url: paymentCheckURL.replace('${host}',siteConfig.payment[0].profiles[mode].host),
		headers: {},
	};
	for (var key in siteConfig.payment[0].headers){
		options.headers[key]=siteConfig.payment[0].profiles[mode][siteConfig.payment[0].headers[key]];
	}
	function callback(error, response, body) {
		res.end(body);
	}
	request(options, callback);
});

router.post('/paymentUpdateHook', parserObj, function(req, res){
	console.log(JSON.stringify(req.body));
});

module.exports = router;
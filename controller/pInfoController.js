'use strict';

var express = require('express');
var router = express.Router();
////////////////////////////////
// Config and logger
////////////////////////////////

//http://localhost:3008/api/pInfo/v1/getPInfo
module.exports.getPInfo = function(req, res) {
	console.log(req.params + " " +req.body);
	
	var result = 'testing result';
	res.json({ 'result': result });
};

//http://localhost:3008/api/pInfo/v1/postPInfo
module.exports.postPInfo = function(req, res) {
	console.log(req.body);
	
};
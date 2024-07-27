'use strict';

var express = require('express');
var router = express.Router();
////////////////////////////////
// Config and logger
////////////////////////////////

module.exports.getRegistration = function(req, res) {
	console.log(req.params + " " +req.body);
	
	var result = 'testing result';
	res.json({ 'result': result });
//    return;
};

module.exports.postRegistration = function(req, res) {
	console.log(req.body);
	
};
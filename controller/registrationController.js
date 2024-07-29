'use strict';

import express from 'express';
var router = express.Router();
////////////////////////////////
// Config and logger
////////////////////////////////

export function getRegistration(req, res) {
	console.log(req.params + " " +req.body);
	
	var result = 'testing result';
	res.json({ 'result': result });
//    return;
};

export function postRegistration(req, res) {
	console.log(req.body);
	
};
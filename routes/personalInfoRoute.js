'use strict';

var express = require('express');
var router = express.Router();
////////////////////////////////
// Config and logger
////////////////////////////////

////////////////////////////////
// Shared variables
////////////////////////////////
var pInfo = require('../controller/pInfoController');

////////////////////////////////
// export funcitons  (Routes)
////////////////////////////////
module.exports = function() {
	router.get('/v1/getPInfo', pInfo.getPInfo);
	router.post('/v1/createPInfo', pInfo.createPInfo);
    router.post('/v1/postPInfo', pInfo.postPInfo);
	return router;
}
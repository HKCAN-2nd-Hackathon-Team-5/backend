'use strict';

var express = require('express');
var router = express.Router();
////////////////////////////////
// Config and logger
////////////////////////////////

////////////////////////////////
// Shared variables
////////////////////////////////
var register = require('../controller/registrationController');

////////////////////////////////
// export funcitons  (Routes)
////////////////////////////////
module.exports = function() {
	router.get('/v1/getRegistration', register.getRegistration);
    router.post('/v1/postRegistration', register.postRegistration);

	return router;
}
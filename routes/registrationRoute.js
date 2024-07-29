'use strict';

import express from 'express';
var router = express.Router();
////////////////////////////////
// Config and logger
////////////////////////////////

////////////////////////////////
// Shared variables
////////////////////////////////
import * as register from '../controller/registrationController.js';

////////////////////////////////
// export funcitons  (Routes)
////////////////////////////////
export default function() {
	router.get('/v1/getRegistration', register.getRegistration);
    router.post('/v1/postRegistration', register.postRegistration);

	return router;
}
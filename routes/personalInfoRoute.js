'use strict';

import express from 'express';
var router = express.Router();
////////////////////////////////
// Config and logger
////////////////////////////////

////////////////////////////////
// Shared variables
////////////////////////////////
import * as pInfo from '../controller/pInfoController.js';

////////////////////////////////
// export funcitons  (Routes)
////////////////////////////////
export default function() {
	router.get('/v1/getPInfo', pInfo.getPInfo);
	router.post('/v1/createPInfo', pInfo.createPInfo);
	router.put('/v1/updatePInfo', pInfo.updatePInfo);
    router.post('/v1/postPInfo', pInfo.postPInfo);
	return router;
}
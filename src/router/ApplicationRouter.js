import express from 'express';
import * as registrationController from '../controller/ApplicationController.js';

let router = express.Router();
router.post('/', registrationController.create);
router.get('/', registrationController.read);
router.put('/', registrationController.update);
router.delete('/', registrationController.remove);
export default router;

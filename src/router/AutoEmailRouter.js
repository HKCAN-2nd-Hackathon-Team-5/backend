import express from 'express';
import * as autoEmailController from '../controller/AutoEmailController.js';

const router = express.Router();
router.post('/registration-confirmation/customer-id/:customerId', autoEmailController.sendRegistrationConfirmation);
export default router;

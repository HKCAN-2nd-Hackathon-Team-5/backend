import express from 'express';
import * as paymentController from '../controller/PaymentController.js';

let router = express.Router();
/*
router.get('/', paymentController.getAllPayment);
router.get('/:id', paymentController.getPaymentByPaymentId);
router.put('/edit', paymentController.updatePaymentByPaymentId);
router.post('/create', paymentController.createPayment);
router.delete('/delete/:id', paymentController.deletePaymentByPaymentId);
*/
//router.get('/', paymentController.createInvoice);	//get invoice no. from PayPal
router.get('/:id', paymentController.getPaymentByPaymentId);
router.put('/edit', paymentController.updatePaymentByPaymentId);
router.post('/create/:applicationid', paymentController.createPayment);
router.delete('/delete/:id', paymentController.deletePaymentByPaymentId);
router.post('/invoice-check', paymentController.checkInvoices);

//get all payment
//get all payment not yet paid
//get payment by Date
//

export default router;

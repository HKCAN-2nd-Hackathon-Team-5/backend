import express from 'express';
import * as paymentController from '../controller/PaymentController.js';

let router = express.Router();
router.get('/:id', paymentController.getPaymentByPaymentId);
router.put('/edit', paymentController.updatePaymentByPaymentId);
router.post('/create/:applicationid', paymentController.createPayment);
router.delete('/delete/:id', paymentController.deletePaymentByPaymentId);
router.post('/invoice-check', paymentController.checkInvoices);

export default router;

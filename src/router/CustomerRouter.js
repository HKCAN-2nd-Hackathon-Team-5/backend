import express from 'express';
import * as customerController from '../controller/CustomerController.js';

const router = express.Router();
let createRoute = '';

customerController.paramName.forEach(param => {
    createRoute += `/:${param}`;
})

router.post(createRoute, customerController.create);
router.get('/', customerController.read);
router.get('/:id', customerController.read);
router.put('/:id/data', customerController.update);
router.delete('/:id', customerController.remove);
export default router;

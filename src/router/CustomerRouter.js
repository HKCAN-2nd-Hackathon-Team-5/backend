import express from 'express';
import * as customerController from '../controller/CustomerController.js';

const router = express.Router();
router.post('/', customerController.create);
router.get('/', customerController.read);
router.get('/:id', customerController.read);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.remove);
export default router;

import express from 'express';
import * as applicationController from '../controller/ApplicationController.js';

let router = express.Router();
router.post('/', applicationController.create);
router.get('/', applicationController.read);
router.put('/', applicationController.update);
router.delete('/', applicationController.remove);
export default router;

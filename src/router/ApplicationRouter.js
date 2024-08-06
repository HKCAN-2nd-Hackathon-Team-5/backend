import express from 'express';
import * as applicationController from '../controller/ApplicationController.js';

let router = express.Router();
router.post('/', applicationController.createApplication);
router.get('/', applicationController.readApplications);
router.get('/:application_id', applicationController.readApplications);
router.put('/', applicationController.updateApplication);
export default router;

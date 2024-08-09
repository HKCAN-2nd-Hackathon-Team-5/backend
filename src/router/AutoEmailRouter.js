import express from 'express';
import * as applicationController from '../controller/AutoEmailController.js';

let router = express.Router();
router.post('/application-confirm', applicationController.sendApplicationConfirm);
router.post('/enroll-confirm', applicationController.sendEnrollConfirm);
export default router;

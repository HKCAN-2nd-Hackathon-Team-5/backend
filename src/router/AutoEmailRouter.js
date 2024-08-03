import express from 'express';
import * as autoEmailController from '../controller/AutoEmailController.js';

const router = express.Router();
router.post('/application-confirmation/student-id/:studentId', autoEmailController.sendApplicationConfirmation);
export default router;

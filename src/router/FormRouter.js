import express from 'express';
import * as formController from '../controller/FormController.js';

let router = express.Router();

router.get('/', formController.getAllForm);
router.get('/:id', formController.getFormByFormId);
router.put('/edit', formController.updateFormByFormId);
router.post('/create', formController.createFormByFormId);
router.delete('/delete/:id', formController.deleteFormByFormId);
router.post('/assign/:id/:courseid', formController.assignCourseToForm);
router.delete('/unassign/:id/:courseid', formController.unassignCourseToForm);
router.get('/:form_id/application', formController.readApplicationsByFormId);
router.get('/:form_id/student-payment', formController.readStudentsPaymentsByFormId);
export default router;

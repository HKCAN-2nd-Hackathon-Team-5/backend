import express from 'express';
import * as studentController from '../controller/StudentController.js';

const router = express.Router();
router.get('/', studentController.read);
router.get('/query', studentController.readBySearch);
router.get('/:student_id', studentController.read);
router.put('/:student_id', studentController.update);
router.delete('/:student_id', studentController.remove);
export default router;

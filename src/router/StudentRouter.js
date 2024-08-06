import express from 'express';
import * as studentController from '../controller/StudentController.js';

const router = express.Router();
router.post('/', studentController.createStudent);
router.get('/', studentController.readStudents);
router.get('/query', studentController.readStudentsBySearch);
router.get('/:student_id', studentController.readStudents);
router.get('/:student_id/application', studentController.readApplicationsByStudentId);
router.put('/:student_id', studentController.updateStudent);
router.delete('/:student_id', studentController.deleteStudent);
export default router;

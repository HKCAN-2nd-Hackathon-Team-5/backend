import express from 'express';
import * as courseController from '../controller/CourseController.js';

let router = express.Router();

router.get('/', courseController.getAllCourse);
router.get('/:id', courseController.getCourseByCourseId);
router.put('/edit', courseController.updateCourseByCourseId);
router.post('/create', courseController.createCourseByCourseId);
router.delete('/delete/:id', courseController.deleteCourseByCourseId);
router.get('/:course_id/paid-student', courseController.readPaidStudentsByCourseId);
export default router;

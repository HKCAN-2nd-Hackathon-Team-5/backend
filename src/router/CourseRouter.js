import express from 'express';
import * as courseController from '../controller/CourseController.js';

let router = express.Router();

router.get('/', courseController.getAllCourse);
router.get('/form/:id', courseController.getAllCourseByFormId);
router.put('/edit/:id', courseController.updateCourseByFormId);
export default router;

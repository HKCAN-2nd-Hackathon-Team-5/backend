import express from 'express';
import * as courseController from '../controller/CourseController.js';

let router = express.Router();

router.get('/:id', courseController.getAllCourseByFormId);
export default router;

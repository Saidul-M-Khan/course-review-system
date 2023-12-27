import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { CourseControllers } from './course.controller';
import {
  createCourseValidationSchema,
  updateCourseValidationSchema,
} from './course.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

//! route to create a course
router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(createCourseValidationSchema),
  CourseControllers.createCourse,
);

//! route to retrieve paginated and filtered courses.
router.get('/', CourseControllers.getPaginatedAndFilteredCourses);

//! route to update a course
router.put(
  '/:courseId',
  auth(USER_ROLE.admin),
  validateRequest(updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

//! route to retrieve course by id with reviews
router.get('/:courseId/reviews', CourseControllers.getCourseWithReviews);

//! route to retrieve the best course based on average review
router.get('/best', CourseControllers.getBestCourse);

export const CourseRoutes = router;

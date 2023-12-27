import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { ReviewValidation } from './review.validation';
import { ReviewControllers } from './review.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../auth/auth.constant';

const router = express.Router();

//! route to create review
router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewControllers.createReview,
);

export const ReviewRoutes = router;

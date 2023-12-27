import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { CategoryControllers } from './category.controller';
import { CategoryValidation } from './category.validation';
import { USER_ROLE } from '../auth/auth.constant';
import auth from '../../middleware/auth';

const router = express.Router();

//! route to create category
router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);

//! route to retrieve all categories
router.get('/', CategoryControllers.getAllCategories);

export const CategoryRoutes = router;

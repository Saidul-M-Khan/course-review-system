import express from 'express';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { UserValidations } from './user.validation';

const router = express.Router();

//! create user manually
router.post(
  '/create-user',
  auth(USER_ROLE.admin),
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

export const UserRoutes = router;
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';

//! create user manually
const createUserIntoDB = async (payload: IUser) => {
  // create user object
  const userData: Partial<IUser> = {};
  // if password not exist then set default password
  userData.password = payload.password || (config.default_password as string);
  // create a user (user | admin)
  const newUser = await User.create(userData);
  if (!newUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to create ${payload.role}`,
    );
  }
  return newUser;
};

export const UserServices = {
  createUserIntoDB,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';

//! user registration
const registerUser = async (payload: IUser) => {
  payload.password = payload.password || (config.default_password as string);
  // create a user (user | admin)
  const newUser = await User.create(payload);
  if (!newUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to create ${payload.role}`,
    );
  }
  return newUser;
};

//! user login
const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByUsername(payload.username);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }
  // create token and sent to the  client
  const jwtPayload = {
    _id: user._id.toString(),
    role: user.role,
    email: user.email,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  return {
    user,
    accessToken,
  };
};

//! password change
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // Checking if the user exists
  const user = await User.isUserExistsByEmail(userData.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  const { passwordHistory }: any =
    await User.findById(user).select('passwordHistory');

  // checking if the old password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // if the old password and new password match then show error
  if (payload.oldPassword === payload.newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Password change failed. Ensure the new password is unique.`,
    );
  }

  const extractedPasswords = [];
  if (passwordHistory && passwordHistory.length > 0) {
    for (const entry of passwordHistory) {
      const passwordHistoryMatchCheck = await User.isPasswordMatched(
        payload.newPassword,
        entry.password,
      );
      if (passwordHistoryMatchCheck) {
        extractedPasswords.push(entry.password);
      }
    }
    if (extractedPasswords.length > 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${passwordHistory[0]?.createdAt}).`,
      );
    }
  }

  // update user
  const updatedUser = await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      $push: {
        passwordHistory: {
          $each: [{ password: user.password, createdAt: new Date() }],
          $slice: -2, // Keep only the last 2
        },
      },
      $sort: {
        'passwordHistory.createdAt': -1, // Sort in descending order based on createdAt
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
  return updatedUser;
};

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
};

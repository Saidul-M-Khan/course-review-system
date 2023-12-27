/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './auth.constant';

export type TLoginUser = {
  username: string;
  password: string;
};

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<IUser> {
  isUserExistsByUsername(id: string): Promise<IUser>;
  isUserExistsByEmail(id: string): Promise<IUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

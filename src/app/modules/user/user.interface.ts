/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TPasswordHistory = {
  password: string;
  createdAt: Date;
};

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  passwordHistory?: TPasswordHistory[];
  role: 'user' | 'admin';
}

export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<IUser> {
  isUserExistsByUsername(username: string): Promise<IUser>;
  isUserExistsByEmail(email: string): Promise<IUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

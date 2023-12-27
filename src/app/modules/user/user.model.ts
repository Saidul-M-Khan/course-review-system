/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { IUser, TPasswordHistory, UserModel } from './user.interface';

//! password history schema
const passwordHistorySchema = new Schema<TPasswordHistory>({
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
});

//! user schema
const userSchema = new Schema<IUser, UserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    passwordHistory: {
      type: [passwordHistorySchema],
      required: false,
      select: 0,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
    },
  },
  {
    timestamps: true,
  },
);

//! hashing password
userSchema.pre('save', async function (next) {
  const user = this;
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

//! override the toJSON method to hide the password field
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password; // Remove the password field from the JSON object
  delete userObject.passwordHistory;
  return userObject;
};

//! static method to check if user exist with username
userSchema.statics.isUserExistsByUsername = async function (username: string) {
  return await User.findOne({ username }).select('+password -createdAt -updatedAt -__v');
};

//! static method to check if user exist with email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

//! password match check
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

//! user model
export const User = model<IUser, UserModel>('User', userSchema);

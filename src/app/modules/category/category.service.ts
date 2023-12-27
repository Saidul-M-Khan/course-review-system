import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import { TCategory } from './category.interface';
import { Category } from './category.model';

//! Create a Category
const createCategoryIntoDB = async (
  userData: JwtPayload,
  payload: TCategory,
) => {
  const user = await User.isUserExistsByEmail(userData.email);
  if (user) {
    payload.createdBy = new Types.ObjectId(user._id);
  }
  const result = await Category.create(payload);
  return result;
};

//! Get All Categories
const getAllCategoriesFromDB = async () => {
  const result = await Category.find().select('-__v').populate({
    path: 'createdBy',
    model: 'User',
    select: '-createdAt -updatedAt -__v',
  });
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};

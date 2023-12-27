import httpStatus from 'http-status';
import { Schema, model } from 'mongoose';
import AppError from '../../errors/AppError';
import { TCategory } from './category.interface';

//! creating schema for Category
const categorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: [true, 'User who created this category is required'],
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

//! creating Category model
export const Category = model<TCategory>('Category', categorySchema);

//! pre hook middleware to detect duplicate category creation
categorySchema.pre('save', async function (next) {
  const isCategoryExist = await Category.findOne({
    name: this.name,
  });
  if (isCategoryExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This category is already exist!');
  }
  next();
});

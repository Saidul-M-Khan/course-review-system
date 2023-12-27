import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';
import { RequestHandler } from 'express';

//! controller to create category 
const createCategory: RequestHandler = catchAsync(async (req, res) => {
  const result = await CategoryServices.createCategoryIntoDB(req.user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Category is created successfully',
    data: result,
  });
});

//! controller to get all categories
const getAllCategories: RequestHandler = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoriesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories are retrieved successfully',
    data: {
      categories: result
    },
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TResponse } from './course.interface';
import { CourseServices } from './course.service';

//! controller to create course
const createCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

//! controller to retrieve paginated and filtered courses
const getPaginatedAndFilteredCourses: RequestHandler = catchAsync(
  async (req, res) => {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const meta: {
      skip: number;
      limit: number;
    } = {
      skip: skip,
      limit: limit,
    };

    const result = await CourseServices.getPaginatedAndFilteredCoursesFromDB(
      req.query,
      meta,
    );

    const modifiedResponse: TResponse = {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Courses retrieved successfully',
      meta: {
        page: page,
        limit: limit,
        total: result.total,
      },
      data: {
        courses: result.data,
      },
    };
    res.json(modifiedResponse);
  },
);

//! controller to update course
const updateCourse: RequestHandler = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const course = req.body;
  const result = await CourseServices.updateCourseFromDB(courseId, course);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

//! controller to retrieve course with review
const getCourseWithReviews: RequestHandler = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getCourseWithReviewsFromDB(courseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course and Reviews retrieved successfully',
    data: result,
  });
});

//! controller to retrieve best course
const getBestCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseServices.getBestCourseFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best course retrieved successfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getPaginatedAndFilteredCourses,
  updateCourse,
  getCourseWithReviews,
  getBestCourse,
};

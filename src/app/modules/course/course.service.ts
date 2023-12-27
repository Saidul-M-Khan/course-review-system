/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { SortOrder, Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { Review } from '../review/review.model';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import { durationInWeeks } from './course.utils';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';

//! Create a Course
const createCourseIntoDB = async (userData: JwtPayload,payload: TCourse) => {
  const user = await User.isUserExistsByEmail(userData.email);
  if (user) {
    payload.createdBy = new Types.ObjectId(user._id);
  }
  const newCourse = await Course.create(payload);
  return newCourse;
};

//! Get Paginated and Filtered Courses
const getPaginatedAndFilteredCoursesFromDB = async (
  query: any,
  meta: {
    skip: number;
    limit: number;
  },
) => {
  // Create a copy of the original query
  const queryObj = { ...query };

  const { limit, skip } = meta;

  // Remove the given fields from excludeFields array
  const excludeFields = ['sort', 'limit', 'tags'];
  excludeFields.forEach((element) => delete queryObj[element]);

  // Sorting
  let sort: string | { [key: string]: SortOrder } = '-createdAt'; // Default sorting

  if (query?.sort) {
    sort = query.sort as string;
  } else if (query?.sortBy) {
    const { sortBy } = query;
    // Check if sortBy is one of the allowed fields
    if (
      [
        'title',
        'price',
        'startDate',
        'endDate',
        'language',
        'durationInWeeks',
      ].includes(sortBy)
    ) {
      // Determine sortOrder
      const sortOrder: SortOrder = query.sortOrder === 'asc' ? 1 : -1;
      sort = { [sortBy]: sortOrder };
    }
  }

  const sortQuery = Course.find({}).select('-__v').populate({
    path: 'createdBy',
    model: 'User',
    select: '-createdAt -updatedAt -__v',
  }).sort(sort);

  // Limiting
  const limitQuery = sortQuery.limit(limit);

  // Pagination
  const paginateQuery = limitQuery.skip(skip);

  // Price Range Filter
  if (query?.minPrice || query?.maxPrice) {
    const priceFilter = {
      price: {
        $gte: query.minPrice || 0,
        $lte: query.maxPrice || Number.MAX_SAFE_INTEGER,
      },
    };
    paginateQuery.find(priceFilter);
  }

  // Tags Filter
  if (query?.tags) {
    const tagsFilter = { tags: { $elemMatch: { name: query?.tags } } };
    paginateQuery.find(tagsFilter);
  }

  // Date Range Filter
  if (query?.startDate || query?.endDate) {
    const dateFilter = {
      startDate: {
        $gte: query.startDate,
      },
      endDate: {
        $lte: query.endDate,
      },
    };
    paginateQuery.find(dateFilter);
  }

  // Language Filter
  if (query?.language) {
    const languageFilter = {
      language: query.language,
    };
    paginateQuery.find(languageFilter);
  }

  // Provider Filter
  if (query?.provider) {
    const providerFilter = {
      provider: query.provider,
    };
    paginateQuery.find(providerFilter);
  }

  // Duration Filter
  if (query?.durationInWeeks) {
    const durationFilter = {
      durationInWeeks: query.durationInWeeks,
    };
    paginateQuery.find(durationFilter);
  }

  // Level Filter
  if (query?.level) {
    const levelFilter = {
      'details.level': query.level,
    };
    paginateQuery.find(levelFilter);
  }

  // Returning Response
  const result = await paginateQuery;

  const total = result.length

  return { data: result, total };
};

//! Update a Course (Partial Update with Dynamic Update)
const updateCourseFromDB = async (id: string, payload: Partial<TCourse>) => {
  const {
    tags,
    details,
    startDate,
    endDate,
    durationInWeeks: prevDurationInWeeks,
    ...remainingCourseData
  } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingCourseData,
  };

  if (tags && tags.length > 0) {
    modifiedUpdatedData['$set'] = { tags };
  }

  if (details && Object.keys(details).length) {
    for (const [key, value] of Object.entries(details)) {
      modifiedUpdatedData[`details.${key}`] = value;
    }
  }

  // Check if both startDate and endDate are defined
  if (startDate !== undefined && endDate !== undefined) {
    const existingCourse = await Course.findById(id);

    if (
      existingCourse &&
      (startDate !== existingCourse.startDate ||
        endDate !== existingCourse.endDate)
    ) {
      // Calculate durationInWeeks based on the updated startDate and endDate
      const newDurationInWeeks = durationInWeeks(startDate, endDate);

      // Update durationInWeeks only if both startDate and endDate are provided
      if (newDurationInWeeks !== prevDurationInWeeks) {
        modifiedUpdatedData['$set'] = {
          ...(modifiedUpdatedData['$set'] || {}),
          durationInWeeks: newDurationInWeeks,
        };
      } else {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Cannot update 'durationInWeeks' directly.",
        );
      }
    }
  }

  const result = await Course.findOneAndUpdate(
    { _id: id },
    modifiedUpdatedData,
    { new: true, runValidators: true },
  ).select('-__v').populate({
    path: 'createdBy',
    model: 'User',
    select: '-createdAt -updatedAt -__v',
  });

  return result;
};

//! Get Course by ID with Reviews
const getCourseWithReviewsFromDB = async (id: string) => {
  const course = await Course.findOne({ _id: id }).select('-__v').populate({
    path: 'createdBy',
    model: 'User',
    select: '-createdAt -updatedAt -__v',
  });

  const reviews = await Review.find({ courseId: id }).select('-__v').populate({
    path: 'createdBy',
    model: 'User',
    select: '-createdAt -updatedAt -__v',
  });

  const result = { course, reviews };

  return result;
};

//! Get the Best Course Based on Average Review (Rating)
const getBestCourseFromDB = async () => {
  const bestCourse = await Review.aggregate([
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
    { $sort: { averageRating: -1, reviewCount: -1 } },
    { $limit: 1 },
  ]);

  const bestCourseId = bestCourse[0]._id;

  const bestCourseFound = await Course.findById(bestCourseId).select('-__v').populate({
    path: 'createdBy',
    model: 'User',
    select: '-createdAt -updatedAt -__v',
  }).lean();

  const result = {
    course: bestCourseFound,
    averageRating: bestCourse[0].averageRating,
    reviewCount: bestCourse[0].reviewCount,
  };

  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getPaginatedAndFilteredCoursesFromDB,
  updateCourseFromDB,
  getCourseWithReviewsFromDB,
  getBestCourseFromDB,
};

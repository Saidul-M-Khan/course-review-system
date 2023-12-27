/* eslint-disable @typescript-eslint/no-this-alias */
import httpStatus from 'http-status';
import { Schema, model } from 'mongoose';
import AppError from '../../errors/AppError';
import { CourseModel, TCourse, TDetails, TTags } from './course.interface';
import { durationInWeeks } from './course.utils';

const tagsSchema = new Schema<TTags>({
  name: {
    type: String,
    required: [true, 'Tag is required'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const detailsSchema = new Schema<TDetails>({
  level: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

//! creating schema for Course
const courseSchema = new Schema<TCourse, CourseModel>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
    },
    instructor: {
      type: String,
      required: [true, 'Instructor is required'],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Category ID is Required'],
      ref: 'Category',
    },
    price: {
      type: Number,
      required: [true, 'Price is Required'],
    },
    tags: {
      type: [tagsSchema],
      required: [true, 'Tag is Required'],
    },
    startDate: {
      type: String,
      required: [true, 'startDate is required'],
    },
    endDate: {
      type: String,
      required: [true, 'endDate is required'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
    },
    provider: {
      type: String,
      required: [true, 'Provider is required'],
    },
    durationInWeeks: {
      type: Number,
    },
    details: {
      type: detailsSchema,
      required: [true, 'Details is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: [true, 'User who created this course is required'],
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

//! pre hook middleware to save durationInWeeks in database
courseSchema.pre<TCourse>('save', function (next) {
  this.durationInWeeks = durationInWeeks(this.startDate, this.endDate);
  next();
});

//! pre hook middleware to detect if the course already exists in the database (during course create)
courseSchema.pre('save', async function (next) {
  const isCourseExist = await Course.findOne({
    name: this.title,
  });
  if (isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This course is already exist!');
  }
  next();
});

//! pre hook middleware to detect if the course not exists in the database (during course update)
courseSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isCourseExist = await Course.findOne(query);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This course does not exist! ');
  }
  next();
});

//! creating Course model
export const Course = model<TCourse, CourseModel>('Course', courseSchema);

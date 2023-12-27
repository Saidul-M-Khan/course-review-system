import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

//! creating schema for Review
const reviewSchema = new Schema<TReview>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Course Id is required'],
      ref: 'Course',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
    },
    review: {
      type: String,
      required: [true, 'Review is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: [true, 'User who created this review is required'],
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

//! creating Review model
export const Review = model<TReview>('Review', reviewSchema);

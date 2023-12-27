import { z } from 'zod';

//! zod validation to create review
const createReviewValidationSchema = z.object({
  body: z.object({
    courseId: z.string({
      invalid_type_error: 'Course Id must be string',
      required_error: 'Course Id is required',
    }),
    rating: z
      .number({
        invalid_type_error: 'Rating must be number',
        required_error: 'Rating is required',
      })
      .min(0)
      .max(5),
    review: z.string({
      invalid_type_error: 'Review must be string',
      required_error: 'Review is required',
    }),
  }),
});

export const ReviewValidation = { createReviewValidationSchema };

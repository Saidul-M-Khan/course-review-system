import { z } from 'zod';

//! zod validation to create category
const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Category must be string',
      required_error: 'Category name is required',
    }),
  }),
});

export const CategoryValidation = { createCategoryValidationSchema };

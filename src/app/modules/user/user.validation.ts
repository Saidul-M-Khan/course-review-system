import { z } from 'zod';

const createUserValidationSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, { message: 'Password cannot be more than 20 characters' })
    .optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

export const UserValidations = { createUserValidationSchema };

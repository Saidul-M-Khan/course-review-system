import { z } from 'zod';

const registerValidationSchema = z.object({
  body: z.object({
    username: z.string(),
    email: z.string(),
    password: z
      .string({
        invalid_type_error: 'Password must be string',
      })
      .max(20, { message: 'Password cannot be more than 20 characters' })
      .optional(),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: 'Username is required.' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
};

/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import { ZodError } from 'zod';
import AppError from '../errors/AppError';
import handleMongooseCastError from '../errors/handleMongooseCastError';
import handleMongooseDuplicateError from '../errors/handleMongooseDuplicateError';
import handleMongooseValidationError from '../errors/handleMongooseValidationError';
import handleZodError from '../errors/handleZodError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  //! setting default values
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessage = 'Something went wrong!';

  //! Detect errors origin and send the errors to error handler
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleMongooseValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleMongooseCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (err?.code === 11000) {
    const simplifiedError = handleMongooseDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessage = err?.message;

    if (statusCode === httpStatus.UNAUTHORIZED) {
      return res.status(statusCode).json({
        success: false,
        message: 'Unauthorized Access',
        errorMessage: err?.message,
        errorDetails: null,
        stack: null,
      });
    }
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessage = err?.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails: process.env.NODE_ENV === 'development' ? err : null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

export default globalErrorHandler;

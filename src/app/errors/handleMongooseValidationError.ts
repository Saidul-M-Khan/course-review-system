import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';

const handleMongooseValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const statusCode = 400;

  const match = err.message.match(/"([^"]*)"/)
  const extractedMessage = match && match[1];
  const errorMessage = `${extractedMessage} is not a valid data!`;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessage,
  };
};

export default handleMongooseValidationError;

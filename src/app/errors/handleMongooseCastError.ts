import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';

const handleMongooseCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = 400;

  const match = err.message.match(/"([^"]*)"/)
  const extractedMessage = match && match[1];

  const errorMessage = `${extractedMessage} is not a valid ID!`;

  return {
    statusCode,
    message: 'Invalid ID',
    errorMessage,
  };
};

export default handleMongooseCastError;

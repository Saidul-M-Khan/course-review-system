import { ZodError, ZodIssue } from 'zod';
import { TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;

  let errorMessage = '';

  const errorMessageList = err.issues.map((issue: ZodIssue) => {
    const errorMessageItem = `${issue?.path[
      issue.path.length - 1
    ]} is required.`;
    return errorMessageItem;
  });

  for (const element of errorMessageList) {
    errorMessage += element.toString() + ' ';
  }

  errorMessage = errorMessage.trim();

  return {
    statusCode,
    message: 'Validation Error',
    errorMessage,
  };
};

export default handleZodError;

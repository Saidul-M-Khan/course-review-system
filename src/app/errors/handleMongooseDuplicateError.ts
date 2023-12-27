import { TGenericErrorResponse } from '../interface/error';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMongooseDuplicateError = (err: any): TGenericErrorResponse => {

    const statusCode = 400;

    const match = err.message.match(/"([^"]*)"/)
    const extractedMessage = match && match[1];

    const errorMessage = `${extractedMessage} already exists!`;


  return {
    statusCode,
    message: 'Duplicate Error',
    errorMessage,
  };

}

export default handleMongooseDuplicateError;
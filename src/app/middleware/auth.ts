import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    try {
      // checking if the token is missing
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You do not have the necessary permissions to access this resource.');
      }

      // checking if the given token is valid
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      const { role, email } = decoded;

      // checking if the user is exist
      const user = await User.isUserExistsByEmail(email);

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
      }

      // role checking
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are attempting to access a resource without the necessary authorization.');
      }

      req.user = decoded as JwtPayload;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'The provided JWT (JSON Web Token) has expired.',
        );
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'The JWT provided is invalid or malformed.',
        );
      } else {
        throw new AppError(httpStatus.UNAUTHORIZED, 'JWT verification failed');
      }
    }
  });
};

export default auth;

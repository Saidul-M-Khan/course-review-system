import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import { TReview } from './review.interface';
import { Review } from './review.model';

//! create a review
const createReviewIntoDB = async (userData: JwtPayload, payload: TReview) => {
  const user = await User.isUserExistsByEmail(userData.email);
  if (user) {
    payload.createdBy = new Types.ObjectId(user._id);
  }
  const createdReview = await Review.create(payload);
  const result = await Review.findById(createdReview._id)
    .select('-__v')
    .populate({
      path: 'createdBy',
      model: 'User',
      select: '-createdAt -updatedAt -__v',
    });
  return result;
};

export const ReviewServices = {
  createReviewIntoDB,
};

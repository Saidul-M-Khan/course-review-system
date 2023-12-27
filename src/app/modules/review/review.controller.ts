import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

//! controller to create review
const createReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.createReviewIntoDB(req.user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
};

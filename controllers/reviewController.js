const Review = require('../models/Review');
const Mentor = require('../models/Mentor');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const { checkPermissions } = require('../utils');

const asyncWrapper = require('../middleware/async');

const createReview = asyncWrapper(async (req, res) => {
  const { mentor: mentorId } = req.body;

  const isValidMentor = await Mentor.findOne({ _id: mentorId });

  if (!isValidMentor) {
    return next(new NotFoundError(`No mentor with id: ${req.params.id}`));
  }

  const alreadySubmitted = await Mentor.findOne({
    mentor: mentorId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    return next(
      new customError.BadRequestError(
        'Already submitted review for this mentor'
      )
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
});

const getAllReviews = asyncWrapper(async (req, res) => {
  const reviews = await Review.find({});

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
});

const getSingleReview = asyncWrapper(async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    return next(new NotFoundError(`No review with id: ${reviewId}`));
  }

  res.status(StatusCodes.OK).json({ review });
});

const updateReview = asyncWrapper(async (req, res) => {
  res.send('update review');
});

const deleteReview = asyncWrapper(async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    return next(new NotFoundError(`No review with id: ${reviewId}`));
  }

  checkPermissions(req.user, review.user);
  await review.deleteOne();

  res.status(StatusCodes.OK).json({ review });
});

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};

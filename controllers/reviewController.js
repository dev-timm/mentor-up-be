const asyncWrapper = require('../middleware/async');

const createReview = asyncWrapper(async (req, res) => {
  res.send('create review');
});

const getAllReviews = asyncWrapper(async (req, res) => {
  res.send('get all reivews');
});

const getSingleReview = asyncWrapper(async (req, res) => {
  res.send('get single review');
});

const updateReview = asyncWrapper(async (req, res) => {
  res.send('update review');
});

const deleteReview = asyncWrapper(async (req, res) => {
  res.send('delete review');
});

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};

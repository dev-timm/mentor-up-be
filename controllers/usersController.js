const User = require('../models/User');
const asyncWrapper = require('../middleware/async');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');

const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
});

const getSingleUser = asyncWrapper(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password');
  if (!user) {
    return next(new NotFoundError(`No user with id: ${req.params.id}`));
  }

  res.status(StatusCodes.OK).json({ user });
});

const ShowCurrentUser = asyncWrapper(async (req, res) => {
  res.send('show current users');
});

const updateUser = asyncWrapper(async (req, res) => {
  res.send('update user');
});

const updateUserPassword = asyncWrapper(async (req, res) => {
  res.send('update user password');
});

module.exports = {
  getAllUsers,
  getSingleUser,
  ShowCurrentUser,
  updateUser,
  updateUserPassword,
};

const User = require('../models/User');
const asyncWrapper = require('../middleware/async');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const { createTokenUser, attachCookiesToResponse } = require('../utils');

const getAllUsers = asyncWrapper(async (req, res) => {
  console.log(req.user);

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
  res.status(StatusCodes.OK).json({ user: req.user });
});

const updateUser = asyncWrapper(async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return next(new customError.BadRequestError('Please provide all values'));
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
});

const updateUserPassword = asyncWrapper(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new BadRequestError('Please provide both value'));
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    return next(new customError.UnauthenticatedError('Invalid Credentials'));
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  ShowCurrentUser,
  updateUser,
  updateUserPassword,
};

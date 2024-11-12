const User = require('../models/User');
const asyncWrapper = require('../middleware/async');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { attachCookiesToResponse } = require('../utils');

const register = asyncWrapper(async (req, res, next) => {
  const { email, name, password } = req.body;

  // checks if email already exists
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    return next(new BadRequestError('Email already exists'));
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ name, email, password, role });
  const tokenUser = { name: user.name, userId: user._id, role: user.role };

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Please provide email and password'));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new UnauthenticatedError('Invalid Credentials'));
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new UnauthenticatedError('Invalid Credentials'));
  }

  const tokenUser = { name: user.name, userId: user._id, role: user.role };

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
});

module.exports = {
  register,
  login,
};

const User = require('../models/User');
const asyncWrapper = require('../middleware/async');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  // checks if email already exists
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    return next(new BadRequestError('Email already exists'));
  }

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
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

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
});

module.exports = {
  register,
  login,
};

const asyncWrapper = require('../middleware/async');

const getAllUsers = asyncWrapper(async (req, res) => {
  res.send('get all users');
});

const getSingleUser = asyncWrapper(async (req, res) => {
  res.send('get single user');
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

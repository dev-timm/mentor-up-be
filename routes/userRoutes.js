const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  ShowCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/usersController');
const { authenticateUser } = require('../middleware/authentication');

router.get('/', authenticateUser, getAllUsers);

router.get('/showMe', ShowCurrentUser);
router.patch('/updateUser', updateUser);
router.patch('/updateUserPassword', updateUserPassword);

router.get('/:id', authenticateUser, getSingleUser);

module.exports = router;

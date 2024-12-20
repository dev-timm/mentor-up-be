const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  ShowCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/usersController');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

router.get('/', authenticateUser, authorizePermissions('admin'), getAllUsers);

router.get('/showMe', authenticateUser, ShowCurrentUser);
router.patch('/updateUser', authenticateUser, updateUser);
router.patch('/updateUserPassword', authenticateUser, updateUserPassword);

router.get('/:id', authenticateUser, getSingleUser);

module.exports = router;

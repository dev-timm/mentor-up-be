const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  ShowCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/usersController');

router.get('/', getAllUsers);
router.get('/showMe', ShowCurrentUser);
router.patch('/updateUser', updateUser);
router.patch('/updateUserPassword', updateUserPassword);
router.get('/:id', getSingleUser);

module.exports = router;

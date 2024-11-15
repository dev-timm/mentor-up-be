const express = require('express');
const router = express.Router();

const {
  getAllMentors,
  createMentor,
  getMentor,
  updateMentor,
  deleteMentor,
} = require('../controllers/mentorsController');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

router
  .route('/')
  .get(getAllMentors)
  .post([authenticateUser, authorizePermissions('admin')], createMentor);
router
  .route('/:id')
  .get(getMentor)
  .patch([authenticateUser, authorizePermissions('admin')], updateMentor)
  .delete([authenticateUser, authorizePermissions('admin')], deleteMentor);

module.exports = router;

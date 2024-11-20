const express = require('express');
const router = express.Router();

const {
  getAllMentors,
  createMentor,
  getMentor,
  updateMentor,
  deleteMentor,
  uploadImage,
} = require('../controllers/mentorsController');

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const { getSingleMentorReviews } = require('../controllers/reviewController');

router
  .route('/')
  .get(getAllMentors)
  .post([authenticateUser, authorizePermissions('admin')], createMentor);

router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin')], uploadImage);

router
  .route('/:id')
  .get(getMentor)
  .patch([authenticateUser, authorizePermissions('admin')], updateMentor)
  .delete([authenticateUser, authorizePermissions('admin')], deleteMentor);

router.route('/:id/reviews').get(getSingleMentorReviews);

module.exports = router;

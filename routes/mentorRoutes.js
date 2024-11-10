const express = require('express');
const router = express.Router();

const {
  getAllMentors,
  createMentor,
  getMentor,
  updateMentor,
  deleteMentor,
} = require('../controllers/mentorsController');

router.route('/').get(getAllMentors).post(createMentor);
router.route('/:id').get(getMentor).patch(updateMentor).delete(deleteMentor);

module.exports = router;

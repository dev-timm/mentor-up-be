const Mentor = require('../models/Mentor');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');

const getAllMentors = asyncWrapper(async (req, res) => {
  const { category, name } = req.query;
  const queryObject = {};

  if (category) {
    queryObject.category = category;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }; // uses $regex query operator https://www.mongodb.com/docs/manual/reference/operator/query/
  }

  console.log(queryObject);

  const mentors = await Mentor.find(queryObject);

  res.status(200).json({ mentors, nbHits: mentors.length });
});

const createMentor = asyncWrapper(async (req, res) => {
  const mentor = await Mentor.create(req.body);
  res.status(201).json({ mentor });
});

const getMentor = asyncWrapper(async (req, res, next) => {
  const { id: mentorID } = req.params;
  const mentor = await Mentor.findOne({ _id: mentorID });
  if (!mentor) {
    return next(createCustomError(`No mentor with id: ${mentorID}`, 404));
  }

  res.status(200).json({ mentor });
});

const deleteMentor = asyncWrapper(async (req, res) => {
  const { id: mentorID } = req.params;
  const mentor = await Mentor.findOneAndDelete({ _id: mentorID });
  if (!mentor) {
    return next(createCustomError(`No mentor with id: ${mentorID}`, 404));
  }

  res.status(200).json({ mentor });
});

const updateMentor = asyncWrapper(async (req, res) => {
  const { id: mentorID } = req.params;
  const mentor = await Mentor.findByIdAndUpdate({ _id: mentorID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!mentor) {
    return next(createCustomError(`No mentor with id: ${mentorID}`, 404));
  }

  res.status(200).json({ mentor });
});

module.exports = {
  getAllMentors,
  createMentor,
  getMentor,
  updateMentor,
  deleteMentor,
};

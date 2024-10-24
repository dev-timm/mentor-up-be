const Mentor = require('../models/Mentor');

const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({});
    res.status(200).json({ mentors });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const createMentor = async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(201).json({ mentor });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getMentor = (req, res) => {
  res.json({ id: req.params.id });
};

const updateMentor = (req, res) => {
  res.send('update mentor profile');
};

const deleteMentor = (req, res) => {
  res.send('delete mentor profile');
};

module.exports = {
  getAllMentors,
  createMentor,
  getMentor,
  updateMentor,
  deleteMentor,
};

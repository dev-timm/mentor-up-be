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

const getMentor = async (req, res) => {
  try {
    const { id: mentorID } = req.params;
    const mentor = await Mentor.findOne({ _id: mentorID });

    if (!mentor) {
      return res.status(404).json({ msg: `no mentor with id: ${mentorID}` });
    }

    res.status(200).json({ mentor });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const deleteMentor = async (req, res) => {
  try {
    const { id: mentorID } = req.params;
    const mentor = await Mentor.findOneAndDelete({ _id: mentorID });

    if (!mentor) {
      return res.status(404).json({ msg: `no mentor with id: ${mentorID}` });
    }

    res.status(200).json({ mentor });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updateMentor = async (req, res) => {
  try {
    const { id: mentorID } = req.params;
    const mentor = await Mentor.findByIdAndUpdate({ _id: mentorID }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!mentor) {
      return res.status(404).json({ msg: `no mentor with id: ${mentorID}` });
    }

    res.status(200).json({ mentor });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getAllMentors,
  createMentor,
  getMentor,
  updateMentor,
  deleteMentor,
};

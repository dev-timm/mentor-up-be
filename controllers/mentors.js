const getAllMentors = (req, res) => {
  res.send('get all mentor profiles');
};

const createMentor = (req, res) => {
  res.json(req.body);
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

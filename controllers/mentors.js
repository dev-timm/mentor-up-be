const Mentor = require('../models/Mentor');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');

const getAllMentors = asyncWrapper(async (req, res) => {
  const { category, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (category) {
    queryObject.category = category;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }; // uses $regex query operator https://www.mongodb.com/docs/manual/reference/operator/query/
  }

  // filter by numeric result e.g. rating
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    // convert from user friendlich expression to mongoose
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    // console.log(filters);
    const options = ['rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  console.log(queryObject);
  let result = Mentor.find(queryObject);

  // sort mentor list
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('name');
  }

  // filter by specific mentor info
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  // paginate mentor results
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const mentors = await result;
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

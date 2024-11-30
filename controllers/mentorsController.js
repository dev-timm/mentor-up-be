const Mentor = require('../models/Mentor');
const asyncWrapper = require('../middleware/async');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const path = require('path');

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
  res.status(StatusCodes.OK).json({ mentors, nbHits: mentors.length });
});

const createMentor = asyncWrapper(async (req, res, next) => {
  req.body.user = req.user.userId;
  const mentor = await Mentor.create(req.body);
  res.status(StatusCodes.CREATED).json({ mentor });
});

const getMentor = asyncWrapper(async (req, res, next) => {
  const { id: mentorID } = req.params;
  const mentor = await Mentor.findOne({ _id: mentorID }).populate('reviews');

  if (!mentor) {
    return next(new NotFoundError(`No mentor with id: ${mentorID}`));
  }

  res.status(StatusCodes.OK).json({ mentor });
});

const deleteMentor = asyncWrapper(async (req, res, next) => {
  const { id: mentorID } = req.params;
  const mentor = await Mentor.findOne({ _id: mentorID });

  if (!mentor) {
    return next(new NotFoundError(`No mentor with id: ${mentorID}`));
  }

  await mentor.deleteOne();

  res.status(StatusCodes.OK).json({ mentor });
});

const updateMentor = asyncWrapper(async (req, res, next) => {
  const { id: mentorID } = req.params;
  const mentor = await Mentor.findByIdAndUpdate({ _id: mentorID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!mentor) {
    return next(new NotFoundError(`No mentor with id: ${mentorID}`));
  }

  res.status(StatusCodes.OK).json({ mentor });
});

const uploadImage = asyncWrapper(async (req, res, next) => {
  if (!req.files) {
    return next(new BadRequestError('No file uploaded'));
  }

  const mentorImage = req.files.image;

  // checks if mimetype is an image
  if (!mentorImage.mimetype.startsWith('image')) {
    return next(new BadRequestError('Please upload image'));
  }

  const maxSize = 1024 * 1024;

  if (mentorImage.size > maxSize) {
    return next(new BadRequestError('Please upload image smaller than 1MB'));
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${mentorImage.name}`
  );
  await mentorImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${mentorImage.name}` });
});

module.exports = {
  getAllMentors,
  createMentor,
  getMentor,
  updateMentor,
  deleteMentor,
  uploadImage,
};

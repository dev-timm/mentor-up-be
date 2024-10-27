const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide name'],
    trim: true,
    minlegth: [4, 'name can not be less than 4 characters long'],
    maxlength: [30, 'name can not be more than 30 characters long'],
  },
  profession: {
    type: String,
    required: [true, 'please provide profession'],
    trim: true,
    minlegth: [3, 'profession can not be less than 3 characters long'],
    maxlength: [100, 'profession can not be more than 100 characters long'],
  },
  expertise: {
    type: String,
    required: [true, 'please provide expertise'],
    trim: true,
    minlegth: [4, 'expertise can not be less than 20 characters long'],
    maxlength: [100, 'expertise can not be more than 30 characters long'],
  },
  experience: {
    type: String,
    required: [true, 'please provide experience'],
    trim: true,
    minlegth: [100, 'experience can not be less than 4 characters long'],
    maxlength: [300, 'experience can not be more than 30 characters long'],
  },
  mentorshipStyle: {
    type: String,
    required: [true, 'please provide mentorship ttyle'],
    trim: true,
    minlegth: [100, 'mentorship style can not be less than 4 characters long'],
    maxlength: [
      300,
      'mentorship style can not be more than 30 characters long',
    ],
  },
  mentorshipClient: {
    type: String,
    required: [true, 'please provide information who should work with you'],
    trim: true,
    minlegth: [100, 'this field can not be less than 4 characters long'],
    maxlength: [300, 'this field can not be more than 30 characters long'],
  },
  category: {
    type: String,
    enum: {
      values: [
        'Development',
        'Business',
        'Finance',
        'Design',
        'Marketing',
        'Product',
        'Sales',
      ],
      message: '{VALUE} is not available',
    },
  },
  published: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Mentor', MentorSchema);

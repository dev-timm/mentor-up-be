const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide name'],
      trim: true,
      maxlength: [30, 'name can not be more than 30 characters long'],
    },
    profession: {
      type: String,
      required: [true, 'please provide profession'],
      trim: true,
      maxlength: [100, 'profession can not be more than 100 characters long'],
    },
    expertise: {
      type: String,
      required: [true, 'please provide expertise'],
      trim: true,
      maxlength: [100, 'expertise can not be more than 100 characters long'],
    },
    experience: {
      type: String,
      required: [true, 'please provide experience'],
      trim: true,
      maxlength: [300, 'experience can not be more than 300 characters long'],
    },
    mentorshipStyle: {
      type: String,
      required: [true, 'please provide mentorship ttyle'],
      trim: true,
      maxlength: [
        300,
        'mentorship style can not be more than 300 characters long',
      ],
    },
    mentorshipClient: {
      type: String,
      required: [true, 'please provide information who should work with you'],
      trim: true,
      maxlength: [300, 'this field can not be more than 300 characters long'],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: { type: Number, default: 0 },
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
    image: {
      type: String,
      default: '/uploads/placeholder.jpg',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

MentorSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'mentor',
  justOne: false,
});

MentorSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function () {
    await this.model('Review').deleteMany({ mentor: this._id });
  }
);

module.exports = mongoose.model('Mentor', MentorSchema);

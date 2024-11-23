const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide title'],
      maxLength: 120,
    },
    comment: {
      type: String,
      trim: true,
      required: [true, 'Please provide text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    mentor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Mentor',
      required: true,
    },
  },
  { timestamps: true }
);

// Ensures that user can only leave one review per mentor
ReviewSchema.index({ mentor: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (mentorId) {
  const result = await this.aggregate([
    { $match: { mentor: mentorId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numberOfReviews: { $sum: 1 },
      },
    },
  ]);
  console.log(result);

  try {
    await this.model('Mentor').findOneAndUpdate(
      { _id: mentorId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numberOfReviews: result[0]?.numberOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.mentor);
  console.log('post save hook called');
});
ReviewSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function () {
    await this.constructor.calculateAverageRating(this.mentor);
  }
);

module.exports = mongoose.model('Review', ReviewSchema);

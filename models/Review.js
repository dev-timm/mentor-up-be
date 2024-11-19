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

module.exports = mongoose.model('Review', ReviewSchema);

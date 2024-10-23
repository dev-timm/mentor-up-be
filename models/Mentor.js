const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  name: String,
  profession: String,
  expertise: String,
  experience: String,
  mentorshipStyle: String,
  mentorshipClient: String,
  published: Boolean,
});

module.export = mongoose.model('Mentor', MentorSchema);

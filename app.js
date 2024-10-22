const express = require('express');
const app = express();
const mentors = require('./routes/mentors');
const connectDB = require('./db/connect');
require('dotenv').config();

// middleware
app.use(express.json());

// routes
app.get('/mentor', (req, res) => {
  res.send('MentorUp');
});

app.use('/api/v1/mentors', mentors);

const port = 3001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

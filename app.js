const express = require('express');
const app = express();

const mentors = require('./routes/mentors');
const auth = require('./routes/auth');

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
require('dotenv').config();
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware
app.use(express.json());

// routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/mentors', authenticateUser, mentors);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3001;

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

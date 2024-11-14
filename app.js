require('dotenv').config();

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const mentorRouter = require('./routes/mentorRoutes');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// security enhancements
// secures headers
app.use(helmet());
// allows other applications to access api
app.use(cors());

// displays accessed routes and status codes in terminal
app.use(morgan('tiny'));

// gives access to json data in req.body
app.use(express.json());

app.use(cookieParser(process.env.JWT_SECRET));

app.get('/', (req, res) => {
  res.send('MentorUp API');
});

app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies);
  res.send('MentorUp API');
});

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/mentors', mentorRouter);

app.use(notFoundMiddleware);
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

const express = require('express');
const app = express();
const mentors = require('./routes/mentors');

// middleware
app.use(express.json());

// routes
app.get('/mentor', (req, res) => {
  res.send('MentorUp');
});

app.use('/api/v1/mentors', mentors);

const port = 3000;

app.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});

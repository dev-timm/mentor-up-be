const express = require('express');
const app = express();

app.get('/mentor', (req, res) => {
  res.send('MentorUp');
});

const port = 3000;

app.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});
